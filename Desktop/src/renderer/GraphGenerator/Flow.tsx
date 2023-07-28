import React, { useState, useEffect } from 'react';
import { ipcRenderer} from 'electron';
import { readFileSync } from 'fs';
import { parse, AsyncAPIDocument} from '@asyncapi/parser';
import ReactFlow, { Background, Panel, useNodesState, useEdgesState, useReactFlow, useStore, useNodes, isNode } from 'reactflow';
import 'reactflow/dist/style.css';
import NodeTypes from '../Nodes';
import { calculateNodesForDynamicLayout } from '../../parser/utils/layout';
import { generateFromSpecs } from '../../parser/parser';



interface AutoLayoutProps {}


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

function handleClick() {
  ipcRenderer.send('button-click');
}


export default function Flow() {

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
    console.log('newNodes',newNodes);
    console.log('newEdges',newEdges);

    //so we have been successfully be able to generate the newNodes and newEdges

    setNodes(newNodes);
    setEdges(newEdges);

  } else {
    console.log('it is still null');
  }
}, [document]); 

  return (
    <>
      <input type="button" value="Select AsyncAPI file" id='btn-readfile' onClick={handleClick} />
      <div style={divStyle}>

        <ReactFlow
          nodeTypes={NodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          // onConnect={onConnect}
          fitView
          style={reactFlowStyle}
        >
          <Background />
          <AutoLayout />

          <Panel position="top-right"> </Panel>
        </ReactFlow>


      </div>

    </>
  );
}
