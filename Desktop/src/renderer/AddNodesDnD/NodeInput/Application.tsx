import React, { useState } from "react";
import "./index.css"; // Import the custom CSS file

export default function Application({ nodes, setNodes }) {
  const [formData, setFormData] = useState({
    description: "",
    title: "",
    version: "",
    license: "",
    externalDocs: "",
    servers: "",
    defaultContentType: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   alert(
  //     `Description: ${formData.description}\n` +
  //     `Title: ${formData.title}\n` +
  //     `Version: ${formData.version}\n` +
  //     `License: ${formData.license}\n` +
  //     `External Docs: ${formData.externalDocs}\n` +
  //     `Servers: ${formData.servers}\n` +
  //     `Default Content Type: ${formData.defaultContentType}`
  //   );
  // };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify(formData));
  };

  return (
    <div onDragStart={(event) => onDragStart(event, 'applicationNode')} draggable>
      <form className="custom-form">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <label htmlFor="version">Version:</label>
        <input
          type="text"
          id="version"
          name="version"
          value={formData.version}
          onChange={handleChange}
        />

        <label htmlFor="license">License:</label>
        <input
          type="text"
          id="license"
          name="license"
          value={formData.license}
          onChange={handleChange}
        />

        <label htmlFor="externalDocs">External Docs:</label>
        <input
          type="text"
          id="externalDocs"
          name="externalDocs"
          value={formData.externalDocs}
          onChange={handleChange}
        />

        <label htmlFor="servers">Servers:</label>
        <input
          type="text"
          id="servers"
          name="servers"
          value={formData.servers}
          onChange={handleChange}
        />

        <label htmlFor="defaultContentType">Default Content Type:</label>
        <input
          type="text"
          id="defaultContentType"
          name="defaultContentType"
          value={formData.defaultContentType}
          onChange={handleChange}
        />

        {/* <button type="submit">Submit</button> */}
      </form>
    </div>
  );
}
