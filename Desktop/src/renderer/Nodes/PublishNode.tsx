import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';


interface IData {
  message: string;
  channel: string
  description: string
  mqttClient?: any;
  autoClient?: any;
}

interface PublishNodeProps {
  data: IData
}

export const PublishNode: React.FunctionComponent<PublishNodeProps> = ({
  data: { message , channel, description, mqttClient, autoClient },
}) => {

  const [topic, setTopic] = useState(channel || '');
  const [payload, setPayload] = useState(message || '');
  const [qos, setQos] = useState(0);

  const client = mqttClient || autoClient

  const handleClick = () => {
    if (client) {
      client.publish(topic, payload, { qos: qos }, function (err) {
        console.log(topic,payload,"T&Pwhild publishing")
        if (err) {
          console.error(err);
        }
      });
    }

  };


  useEffect(() => {
    if(autoClient){
      autoClient.connect()
    }
  }, [])
  

  return (
    <div style={{ margin: '0.7rem', padding: '1rem', border: '1px solid #3498db', borderRadius: '0.5rem', fontFamily: 'Arial, sans-serif', backgroundColor: 'rgba(173, 216, 230, 0.32)' }}>
      <div>
        <span style={{ letterSpacing: '0.05em', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>YOU CAN PUBLISH</span>
        <div>
          <h3>{channel}</h3>
          {description && (
            <div>
              {description}
            </div>
          )}
        </div>
        <hr />
        <div>
          <span>
            Messages
          </span>
          <span>
            Payloads you can publish using this channel
          </span>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#66B2FF', width: '8px', height: '8px', }}
          onConnect={(params) => console.log('handle onConnect', params)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <div>
          <label htmlFor="topic" style={{
            letterSpacing: '0.05em',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            display: 'block',
          }}>TOPIC TO PUBLISH</label>
        </div>
        <div>
          <input
            id="topic"
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{
              appearance: 'none',
              display: 'block',
              width: '100%',
              backgroundColor: '#edf2f7',
              color: '#4a5568',
              border: '1px solid #edf2f7',
              borderRadius: '0.25rem',
              padding: '0.75rem 1rem',
              marginBottom: '0.75rem',
              lineHeight: '1.5',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label
              style={{
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                marginBottom: '0.25rem',
              }}
              htmlFor="qos"
            >
              QoS
            </label>
          </div>
          <div style={{ position: 'relative' }}>
            <select
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#E2E8F0',
                border: '1px solid #E2E8F0',
                color: '#4A5568',
                padding: '0.75rem 1rem 0.75rem 1rem',
                paddingRight: '2rem',
                borderRadius: '0.25rem',
                lineHeight: '1.25',
                outline: 'none',
              }}
              id="qos"
              value={qos}
              onChange={(e) => setQos(Number(e.target.value))}
            >
              <option>0</option>
              <option>1</option>
              <option>2</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'start' }}>
          <label htmlFor="payload" style={{
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>PAYLOAD</label>
        </div>

        <div>
          <textarea
            id="payload"
            rows="4"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            style={{
              appearance: 'none',
              display: 'block',
              width: '100%',
              backgroundColor: '#edf2f7',
              color: '#4a5568',
              border: '1px solid #edf2f7',
              borderRadius: '0.25rem',
              padding: '0.75rem 1rem',
              marginBottom: '0.75rem',
              lineHeight: '1.5',
              outline: 'none'
            }}
          ></textarea>
        </div>

        <button onClick={handleClick} style={{
          padding: '0.5rem 0.6rem',
          color: 'white',
          background: 'none',
          border: '1px solid #3498db',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontSize: '0.6rem',
          fontWeight: 'bold',
        }} >Publish Message</button>
      </div>

    </div >
  );
};

export default PublishNode;