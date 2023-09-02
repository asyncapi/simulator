// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import ScenarioEditor from './components/ScenarioEditor';
import ScenarioVisualizer from './components/ScenarioVisualizer';
import SideBar from './components/SideBar';
import ReactFlow, { Background, Controls } from 'reactflow';
import ApiVisualizer from 'renderer/GraphGenerator/ApiVisualizer';

function ScenarioWorkbench({ EditorState, dispatch }): JSX.Element {

  return (
    <>
      <SideBar EditorState={EditorState} dispatch={dispatch} />
      <ApiVisualizer/>
    </>
  );
}

export default ScenarioWorkbench;