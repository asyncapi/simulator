import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ipcRenderer } from 'electron';
import { readFileSync } from 'fs';
import { parse, AsyncAPIDocument } from '@asyncapi/parser';
import ReactFlow, { Background, Panel, useNodesState, useEdgesState} from 'reactflow';
import 'reactflow/dist/style.css';
import NodeTypes from '../Nodes';
import { AutoLayout } from '../../parser/utils/layout';
import { generateFromSpecs } from '../../parser/flowGenerator';
import AddButton from 'renderer/AddNodesDnD/AddButton';
import './index.css';
import { connect } from 'mqtt';


const divStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'green',
};

const reactFlowStyle = {
  background: '#1a365d',
  width: '100%',
  height: 300,
};


export default function ApiVisualizer() {

  const [document, setDocument] = useState<AsyncAPIDocument | null>(null);

  async function parseYamlFile(filePath: string): Promise<AsyncAPIDocument | void> {
    try {
      const yamlContent: string = readFileSync(filePath, 'utf8');
      const parsedAsyncAPI: AsyncAPIDocument = await parse(yamlContent);

      setDocument(parsedAsyncAPI)

    } catch (error) {
      console.error('Error parsing YAML file:', error);
    }
  }


  useEffect(() => {
    const handleIPCMessage = (_event: any, message: string) => {
      parseYamlFile(message)
    };

    ipcRenderer.on('asynchronous-message', handleIPCMessage);

    return () => {
      ipcRenderer.removeListener('asynchronous-message', handleIPCMessage);
    };
  }, []);


  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);


  useEffect(() => {
    if (document !== null) {
      const elements = generateFromSpecs(document);


      const newNodes = elements.map(el => el.node).filter(Boolean);
      const newEdges = elements.map(el => el.edge).filter(Boolean);


      setNodes(newNodes);
      setEdges(newEdges);

    } else {
      console.log('it is still null');
    }
  }, [document]);



  const onConnect = useCallback((connection) => {

    const newEdge = {
      id: `${connection.source}-to-application-${connection.target}`,
      source: connection.source,
      target: connection.target,
      animated: true,
      label: 'label',
      style: { stroke: '#7ee3be', strokeWidth: 4 },
    };

    setEdges((eds) => [...eds, newEdge]);

    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);



    if(sourceNode?.type === 'publishNode' || sourceNode?.type === 'subscribeNode'){
      sourceNode?.data.mqttClient.connect();

      sourceNode?.data.mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker as source node');
      });
    }

    if(targetNode?.type === 'publishNode' || targetNode?.type === 'subscribeNode'){
      targetNode?.data.mqttClient.connect();

      targetNode?.data.mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker as target node ');
      });
    }

  }, [setEdges,nodes]);


  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);


  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  function createMqttClient() {
    
    const client = connect('mqtt://localhost:1883', {
      manualConnect: true,
    });

    return client;

  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const Data = JSON.parse(event.dataTransfer.getData('application/json'));


      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      let newNode
      
      if(type === 'subscribeNode'){

        const mqttClient = createMqttClient();

        newNode = {
          data: {topic: `${Data.topic}`,QOS: Data.qos, id: Data.id, tags: Array(0), messages: Array(1), spec: AsyncAPIDocument, mqttClient},
          dragging: true,
          height: 143,
          id: `subscribe-${Data.id}`,
          position: position,
          positionAbsolute: position,
          selected: false,
          type: "subscribeNode",
          width: 394
        }
      }else if(type === 'publishNode'){

        const mqttClient = createMqttClient();

        newNode = {
          data: {title: 'receiveLightMeasurement',message: Data.message, channel: `${Data.channel}`, tags: Array(0), messages: Array(1), spec: AsyncAPIDocument, mqttClient},
          ref: 'apple',
          id: `publish-${Data.channel}`,
          position: position,
          type: "publishNode"
        }
      }else{
        newNode = {
          data: Data,
          id: "application",  
          position: position,
          type: "applicationNode",
        }
      }
      

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );


  const onEdgesDelete = (edges) => {
    edges.forEach((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);

      if(sourceNode?.type === 'publishNode' || sourceNode?.type === 'subscribeNode'){
        sourceNode?.data.mqttClient?.end();
      }
  
      if(targetNode?.type === 'publishNode' || targetNode?.type === 'subscribeNode'){
        targetNode?.data.mqttClient?.end();
      }

    });
  };

  return (
    <>
      <div className="dndflow">
        <div style={divStyle}>

          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodeTypes={NodeTypes}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onEdgesDelete={onEdgesDelete}
              onConnect={onConnect}
              fitView
              style={reactFlowStyle}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <Background />
              <AutoLayout />

              <Panel position="top-right">
                <AddButton nodes={nodes} setNodes={setNodes} />
              </Panel>
            </ReactFlow>
          </div>

        </div>
      </div>
    </>
  );
}
