import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ipcRenderer } from 'electron';
import { readFileSync } from 'fs';
import { parse, AsyncAPIDocument } from '@asyncapi/parser';
import ReactFlow, { Background, Panel, useNodesState, useEdgesState, useReactFlow, useStore, useNodes, isNode, addEdge, ReactFlowProvider, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import NodeTypes from '../Nodes';
import { calculateNodesForDynamicLayout } from '../../parser/utils/layout';
import { generateFromSpecs } from '../../parser/flowGenerator';
import AddButton from 'renderer/AddNodesDnD/AddButton';
import Sidebar from './Sidebar';

import './index.css';

interface AutoLayoutProps { }


const AutoLayout: FunctionComponent<AutoLayoutProps> = () => {
  const { fitView } = useReactFlow();
  const nodes = useNodes();
  const setNodes = useStore(state => state.setNodes);

  useEffect(() => {
    if (nodes.length === 0 || !nodes[0].width) {
      return;
    }

    const nodesWithOrginalPosition = nodes.filter(node => node.position.x === 0 && node.position.y === 0);
    if (nodesWithOrginalPosition.length > 1) {
      const calculatedNodes = calculateNodesForDynamicLayout(nodes);
      setNodes(calculatedNodes);
      fitView();
    }
  }, [nodes]);

  return null;
};



const divStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#f0f0f0',
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
    // Define the event listener for the 'asynchronous-message' event
    const handleIPCMessage = (_event: any, message: string) => {
      console.log(message);
      parseYamlFile(message)
    };

    // Attach the event listener when the component mounts
    ipcRenderer.on('asynchronous-message', handleIPCMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      ipcRenderer.removeListener('asynchronous-message', handleIPCMessage);
    };
  }, []); // Empty dependency array ensures that the effect runs only once, on mount


  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);



  useEffect(() => {
    if (document !== null) {
      const elements = generateFromSpecs(document);
      console.log('generated elements1', elements);

      //new entities....

      const newNodes = elements.map(el => el.node).filter(Boolean);
      const newEdges = elements.map(el => el.edge).filter(Boolean);
      console.log('newNodes', newNodes);
      console.log('newEdges', newEdges);

      //so we have been successfully be able to generate the newNodes and newEdges

      setNodes(newNodes);
      setEdges(newEdges);

    } else {
      console.log('it is still null');
    }
  }, [document]);

  // const onConnect = useCallback(
  //   (connection) => setEdges((eds) => addEdge(connection, eds)),
  //   [setEdges]
  // );

  const onConnect = useCallback((connection) => {
    // Create a new edge object based on the customEdge template
    const newEdge = {
      id: `${connection.source}-to-application-${connection.target}`, // Generate a unique ID
      source: connection.source,
      target: connection.target,
      animated: true,
      label: 'label',
      style: { stroke: '#7ee3be', strokeWidth: 4 },
    };

    console.log('hua ree',connection)
  
    // Add the new edge to the edges list
    setEdges((eds) => [...eds, newEdge]);
  }, [setEdges]);
  


  //the creation of nodes and edges through file have been sorted out 
  //now work on the creation of nodes and edges manually...

  const [draggedPosition, setDraggedPosition] = useState<{ x: number, y: number } | null>(null);

  const handleDragEnd = (e: { preventDefault: () => void; clientX: any; clientY: any; }) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    setDraggedPosition({ x, y });
    //state updates are not instantanious
    //so we can use useEffect for logging
    
  };

  //create a function to add a node
  //try to add a new fucking node using this thing
  //and let's see how we can modify it later
  //the list of nodes are an array of objects 
  //we will insert a new objec here.
  const addNode = (position: { x: number; y: number; }) => {
    setNodes([
      ...nodes,
      {
        data: {title: undefined, channel: 'example-channel', tags: Array(0), messages: Array(1), spec: AsyncAPIDocument, },
        dragging: false,
        height: 143,
        id: "subscribe-example-channel",
        position: position,
        positionAbsolute: position,
        selected: true,
        type: "subscribeNode",
        width: 394
      },
    ])
  }

  //now fix the position wher it is being created..
  //when the position has updated then only we would like to add a node right..

  //now try to add nodes using input data
  //and from there expand to adding myltiple kinds of nodes 
  //and then finally connecting them

  //and then improve the UI
  //and then the task will be over..

  



  useEffect(() => {
    console.log(draggedPosition)
    console.log(nodes)
    //then we will try to add a new node here/
    //the node is rendered using a react component
    //we do not have t push a react component in reutrn 
    //insted we will be pushing a json which will be triggered later.
    if (draggedPosition != null) {
      // Your code here
      addNode(draggedPosition)
    }
    
  }, [draggedPosition])

  //now in the dragged position we will create a new publish node.
  //wher are the nodes stored and how can we create new ones

  //at the end of the drop print apples then print nodes 
  //and then try to put a new node 

  //it is broken but it's still working.

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);


  let id = 0;
  const getId = () => `dndnode_${id++}`;


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

      console.log('aaya to tha data', Data)
      

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      // const newNode = {
      //   id: getId(),
      //   type,
      //   position,
      //   data: { label: `${type} node` },
      // };

      //this is how nodes are created officially
      //now try to create all kinds of nodes

      // const newNode = {
        // data: {title: undefined, channel: `${Data.channel}`, tags: Array(0), messages: Array(1), spec: AsyncAPIDocument, },
        // dragging: true,
        // height: 143,
        // id: `subscribe-${Data.channel}`,
        // position: position,
        // positionAbsolute: position,
        // selected: false,
        // type: "subscribeNode",
        // width: 394
      // }

      let newNode

      //we will create the new-node based on 

      //Application node
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
      }else{//this is an application node
        //we are never passing the spces which is requried for the auto creation from the file 
        //and this will always pass the empty file so what to do next??
        //but this is only for hte on-drop, what about the normal functioning
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
            <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100%', height: '700px' }}>
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
                  {/* <div draggable onDragEnd={handleDragEnd} > */}
                  <AddButton nodes={nodes} setNodes={setNodes} />
                  {/* </div> */}
                </Panel>
              </ReactFlow>
            </div>
            <Sidebar />
          </ReactFlowProvider>
        </div>
      </div>
    </>
  );
}
