// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import SideBar from './components/SideBar';

function ScenarioWorkbench({ EditorState, dispatch }): JSX.Element {
  return (
    <>
      <SideBar EditorState={EditorState} dispatch={dispatch} />
    </>
  );
}

export default ScenarioWorkbench;
