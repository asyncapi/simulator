// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import ScenarioEditor from './components/ScenarioEditor';
import ScenarioVisualizer from './components/ScenarioVisualizer';
import SideBar from './components/SideBar';
import ReactFlow, { Background, Controls } from 'reactflow';
import ApiVisualizer from 'renderer/GraphGenerator/ApiVisualizer';

function ScenarioWorkbench({ EditorState, dispatch }): JSX.Element {
  
  

  //when we start dragging the on-drag-enter will get trigerred
  //and then we can mentain state to update the mouse location while we are draggint it 
  //track the mouse location

  //this state will store the updated mouse location 
  // const [target, setTarget] = useState({
  //   cid:"",
  //   bid:""
  // })

  // const handleDragEnter=(e)=>{
  //   console.log('Apple')
  //   e.preventDefault();
  //   // setTarget({
  //   //   cid,
  //   //   bid,
  //   // })
  // }




  //now at that dragged position we will do is create a new node of a type .

  //we will have all the states here
  //and we will access it somewhere

  //maybe this is not the right place to do that 
  //and i shall prefer it doing inside the api-visualizer
  

  return (
    <>
      <SideBar EditorState={EditorState} dispatch={dispatch} />
      <ApiVisualizer/>
      
      
    </>
  );
}

export default ScenarioWorkbench;