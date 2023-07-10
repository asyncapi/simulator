import React, { useState, useCallback } from 'react';
import ReactFlow, { addEdge, Background, Controls, applyEdgeChanges, applyNodeChanges, Panel } from 'reactflow';
import 'reactflow/dist/style.css';

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' },
{ id: 'e2-3', source: '2', target: '3', animated: true },];

const nodeStyle = {
  color: '#0041d0',
  borderColor: '#0041d0',
};

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
    style: nodeStyle,
  },

  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
];

const Flow = () => {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const [variant, setVariant] = useState('cross');

  const reactFlowStyle = {
    background: '#1a365d',
    width: '100%',
    height: 300,
  };

  return (
    <ReactFlow
    style={reactFlowStyle}
    nodes={nodes}
    onNodesChange={onNodesChange}
    edges={edges}
    onEdgesChange={onEdgesChange}
    onConnect={onConnect}
    fitView
    >
    <Background />
    
    <Panel position="top-right"> </Panel>
    </ReactFlow>

  )
}

export default Flow