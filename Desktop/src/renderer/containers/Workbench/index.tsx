// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import ScenarioEditor from './components/ScenarioEditor';
import ScenarioVisualizer from './components/ScenarioVisualizer';
import SideBar from './components/SideBar';
import ReactFlow, { Background, Controls } from 'reactflow';
import Flow from './components/Flow';

function ScenarioWorkbench({ EditorState, dispatch }): JSX.Element {
  return (
    <>
      <SideBar EditorState={EditorState} dispatch={dispatch} />
      {/* <ScenarioEditor EditorState={EditorState} dispatch={dispatch} /> */}
      {/* <ScenarioVisualizer EditorState={EditorState} dispatch={dispatch} /> */}
      <Flow/>

    </>
  );
}

export default ScenarioWorkbench;