import React, { useEffect } from "react";
import { useState } from "react";
import "./index.css"; 

export default function Subscribe({ nodes, setNodes }) {
  
  const [formData, setFormData] = useState({ channel: "", description: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify(formData));
  };

  return (
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
