import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ipcRenderer } from 'electron';
import { readFileSync } from 'fs';
import { parse, AsyncAPIDocument } from '@asyncapi/parser';
import ReactFlow, { Background, Panel, useNodesState, useEdgesState, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import NodeTypes from '../Nodes';
import { AutoLayout } from '../../parser/utils/layout';
import { generateFromSpecs } from '../../parser/flowGenerator';
import AddButton from 'renderer/AddNodesDnD/AddButton';
import './index.css';


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
      console.log(message);
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
  }, [setEdges]);


  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);


  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

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
        newNode = {
          data: {title: undefined, channel: `${Data.channel}`, tags: Array(0), messages: Array(1), spec: AsyncAPIDocument, },
          dragging: true,
          height: 143,
          id: `subscribe-${Data.channel}`,
          position: position,
          positionAbsolute: position,
          selected: false,
          type: "subscribeNode",
          width: 394
        }
      }else if(type === 'publishNode'){
        newNode = {
          data: {title: 'receiveLightMeasurement', channel: `${Data.channel}`, tags: Array(0), messages: Array(1), spec: AsyncAPIDocument,},
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


  return (
    <>
      <div className="dndflow">
        <div style={divStyle}>
          <ReactFlowProvider>
            <div className="reactflow-wrapper" ref={reactFlowWrapper}>
              <ReactFlow
                nodeTypes={NodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
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
          </ReactFlowProvider>
        </div>
      </div>
    </>
  );
}
