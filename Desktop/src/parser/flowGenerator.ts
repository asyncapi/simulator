import { AsyncAPIDocument, Channel, Operation, Message } from '@asyncapi/parser';
import { Edge, Node } from 'reactflow';
import { connect } from 'mqtt';

interface FileredChannel {
  channel: string;
  channelModel: Channel; 
  operationModel: Operation; 
  messagesModel: Message[]; 
}

function createMqttClient() {
    
  const client = connect('mqtt://localhost:1883', {
    manualConnect: true,
  });

  return client;

}

//given the operation publish/subscribe we will extract the channels realted to it from the spec
function getChannelsByOperation(operation: string, spec: AsyncAPIDocument) {
    const channels = spec.channels();
    return Object.keys(channels).reduce((filteredChannels: FileredChannel[], channel) => {
      const operationFn = operation === 'publish' ? 'hasPublish' : 'hasSubscribe';
      // eslint-disable-next-line
      if (channels[String(channel)][operationFn]()) {
        const operationModel = (channels as any)[String(channel)][String(operation)]() as OldOperation;
        filteredChannels.push({
          channel,
          channelModel: channels[String(channel)],
          operationModel,
          messagesModel: operationModel.messages(),
        });
      }
      return filteredChannels;
    }, []);
  }
  
  function buildFlowElementsForOperation({ operation, spec, applicationLinkType, data }: { operation: 'publish' | 'subscribe'; spec: AsyncAPIDocument; applicationLinkType: string, data: any }): Array<{ node: Node, edge: Edge }> {
    return getChannelsByOperation(operation, spec).reduce((nodes: any, channel) => {
      const { channelModel, operationModel, messagesModel } = channel;

      const mqttClient = createMqttClient();
  
      const node: Node = {
        id: `${operation}-${channel.channel}`,
        type: `${operation}Node`,
        data: {
          title: operationModel.id(),
          channel: channel.channel,
          tags: operationModel.tags(),
          messages: messagesModel.map((message) => ({
            title: message.uid(),
            description: message.description(),
          })),
          autoClient: mqttClient,
          spec,
          description: channelModel.description(),
          operationId: operationModel.id(),
          elementType: operation,
          theme: operation === 'subscribe' ? 'green' : 'blue',
          ...data
        },
        position: { x: 0, y: 0 },
      };
  
      const edge: Edge = {
        id: `${operation}-${channel.channel}-to-application`,
        // type: 'smoothstep',
        animated: true,
        label: messagesModel.map(message => message.uid()).join(','),
        style: { stroke: applicationLinkType === 'target' ? '#00A5FA' : '#7ee3be', strokeWidth: 4 },
        source: applicationLinkType === 'target' ? `${operation}-${channel.channel}` : 'application',
        target: applicationLinkType === 'target' ? 'application' : `${operation}-${channel.channel}`,
      };
  
      return [...nodes, { node, edge }];
    }, []);
  }
  
  
  //this will be the entry point of the node creation where we will us the specs to create the application, the publish and the subscribe nodes
  export function generateFromSpecs(spec: AsyncAPIDocument): Array<{node:Node, edge:Edge}>{
    //here we will use the publish operation to generate the nodes and edges for the publish section col-1
    const publishNodes = buildFlowElementsForOperation({
      operation: 'publish',
      spec,
      applicationLinkType: 'target',
      data: { columnToRenderIn: 'col-1' },
    });
    //here we will use the subscribe operation to generate the nodes and edges for subscribe section col-3
    const subscribeNodes = buildFlowElementsForOperation({
      operation: 'subscribe',
      spec,
      applicationLinkType: 'source',
      data: { columnToRenderIn: 'col-3' },
    });
    //here we will build the application node which will lie in the center of the canvas
    const applicationNode = {
      id: 'application',
      type: 'applicationNode',
      data: { spec, elementType: 'application', theme: 'indigo', columnToRenderIn: 'col-2' },
      position: { x: 0, y: 0 },
    }
  
    return [
      ...publishNodes, 
      { node: applicationNode } as { node: Node, edge: Edge }, 
      ...subscribeNodes
    ];
  
  }