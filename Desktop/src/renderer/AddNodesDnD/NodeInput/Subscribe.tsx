import React, { useEffect } from "react";
import { useState } from "react";
import "./index.css"; // Assuming you save the provided CSS in a file named "Subscribe.css"
import { parse, AsyncAPIDocument } from '@asyncapi/parser';

export default function Subscribe({ nodes, setNodes }) {
  
  const [formData, setFormData] = useState({ channel: "", description: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(
      `Name: ${formData.channel}, Email: ${formData.description}, Message: ${formData.message}`
    );
  };

  // const [draggedPosition, setDraggedPosition] = useState<{ x: number, y: number } | null>(null);

  // const handleDragEnd = (e: { preventDefault: () => void; clientX: any; clientY: any; }) => {
  //   e.preventDefault();
  //   const x = e.clientX;
  //   const y = e.clientY;
  //   setDraggedPosition({ x, y });
  //   //state updates are not instantanious
  //   //so we can use useEffect for logging
    
  // };

  //create a function to add a node
  //try to add a new fucking node using this thing
  //and let's see how we can modify it later
  //the list of nodes are an array of objects 
  //we will insert a new objec here.
  // const addNode = (position: { x: number; y: number; }) => {
  //   const newChannel = formData.channel;
  //   setNodes([
  //     ...nodes,
  //     {
  //       data: {title: undefined, channel: newChannel, tags: Array(0), messages: Array(1), spec: AsyncAPIDocument, },
  //       dragging: true,
  //       height: 143,
  //       id: `subscribe-${newChannel}`,
  //       position: position,
  //       positionAbsolute: position,
  //       selected: true,
  //       type: "subscribeNode",
  //       width: 394
  //     },
  //   ])
  // }


  //now fix the position wher it is being created..
  //when the position has updated then only we would like to add a node right..

  //now try to add nodes using input data
  //and from there expand to adding myltiple kinds of nodes 
  //and then finally connecting them

  //and then improve the UI
  //and then the task will be over..

  



  // useEffect(() => {
  //   console.log(draggedPosition)
  //   console.log(nodes)
  //   //then we will try to add a new node here/
  //   //the node is rendered using a react component
  //   //we do not have t push a react component in reutrn 
  //   //insted we will be pushing a json which will be triggered later.
  //   if (draggedPosition != null) {
  //     // Your code here
  //     addNode(draggedPosition)
  //   }
    
  // }, [draggedPosition])

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify(formData));
  };

  return (
    // <div draggable onDragEnd={handleDragEnd}>
      <div onDragStart={(event) => onDragStart(event, 'subscribeNode')} draggable>
      <form className="custom-form">
        <label htmlFor="channel">Channel:</label>
        <input
          type="text"
          id="channel"
          name="channel"
          value={formData.channel}
          onChange={handleChange}
        />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
        />

      </form>
    </div>
  );
}
