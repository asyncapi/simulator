import React, { useEffect } from "react";
import { useState } from "react";
import "./index.css";

export default function Subscribe({ nodes, setNodes }) {

  const [formData, setFormData] = useState({ topic: "", qos: 0, id: ""});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify(formData));
  };

  const QosOptions = [
    { value: 0, label: '0 - At most once' },
    { value: 1, label: '1 - At least once' },
    { value: 2, label: '2 - Exactly once' },
  ];

  const handleQosChange = (e) => {
    const selectedQos = e.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, qos: selectedQos }));
  };

  return (
    <div onDragStart={(event) => onDragStart(event, 'subscribeNode')} draggable>
      <form className="custom-form" >

      <label htmlFor="id">ID:</label>
        <input
          type="id"
          id="id"
          name="id"
          value={formData.id}
          onChange={handleChange}
        />

        <label htmlFor="topic">Topic:</label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
        />

        {/* <label htmlFor="qos">Qos:</label>
        <input
          type="text"
          id="qos"
          name="qos"
          value={formData.qos}
          onChange={handleChange}
        /> */}

<label htmlFor="qos">QoS:</label>
      <div>
        <input
          type="number"
          id="qos"
          name="qos"
          value={formData.qos}
          onChange={handleChange}
          min="0"
          max="2"
        />
        <select
          id="qosOptions"
          name="qosOptions"
          value={formData.qos}
          onChange={handleQosChange}
        >
          {QosOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      </form>
    </div>
  );
}
