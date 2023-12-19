import { Handle, Position } from 'reactflow';
import { FunctionComponent, useEffect } from 'react';
import React, { useState } from 'react';



interface IData {
  messages: any[]
  topic: string
  description: string
  id: string
  mqttClient?: any;
  autoClient?: any;
}

interface PublishNodeProps {
  data: IData
}

export const SubscribeNode: FunctionComponent<PublishNodeProps> = ({ data: { topic, description, messages, mqttClient, id, QOS, autoClient } }) => {

  const [subTopic, setSubTopic] = useState(topic || '');
  const [qos, setQos] = useState(QOS || 0);

  const client = mqttClient || autoClient

  const handleClick = () => {
    if (client) {
      client.subscribe(subTopic, { qos: qos }, function (err) {
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

    if (client) {
      client.on('message', function (topic, message) {
        console.log(message.toString())
        handleAddMessage(message.toString()+ "--/" + topic.toString())
      })
    }
  }, [])
  

  const [message, setMessage] = useState([]);


  const handleAddMessage = (mes: string) => {
    setMessage((prevMessages) => [...prevMessages, mes]);
  };

  const handleDeleteMessage = (index) => {
    const updatedMessages = [...message];
    updatedMessages.splice(index, 1);
    setMessage(updatedMessages);
  };

  const handleDeleteAllMessages = () => {
    setMessage([]);
  };

  return (
    <div style={{ margin: '0.7rem', padding: '1rem', border: '1px solid #22C55E', borderRadius: '0.5rem', fontFamily: 'Arial, sans-serif', backgroundColor: 'rgba(173, 230, 173, 0.32)' }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#90EE90', width: '8px', height: '8px', }}
      />
      <div>
        <div>
          <span style={{ letterSpacing: '0.05em', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            YOU CAN SUBSCRIBE
          </span>
        </div>
        <div>
          <h3>{id}</h3>
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
            Payloads to expect from listening to this channel
          </span>
          <div>
            {messages.map((message) => {
              return (
                <div
                  key={message.title}
                >
                  <div>
                    <div>
                      {message.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
        <label
          htmlFor="subTopic" style={{
            letterSpacing: '0.05em',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            display: 'block',
          }}
        >
          TOPIC TO SUBSCRIBE
        </label>
        <div>
          <input
            id="subTopic"
            type="text"
            placeholder="Topic"
            value={subTopic}
            onChange={(e) => setSubTopic(e.target.value)}
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


        <div style={{ width: '100%', }}>
          <div style={{
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>Messages Received</div>
          <div style={{ border: '1px solid #edf2f7', borderRadius: '0.25rem', padding: '0.5rem', maxHeight: '5rem', overflowY: 'auto', marginBottom: '0.5rem' }}>
            {message.length === 0 ? (
              <div>No messages</div>
            ) : (
              message.map((message, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <div style={{
                    padding: '0.3rem 0.3rem',
                    background: 'rgba(173, 230, 173, 0.22)',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                  }}>
                    {message}
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(index)}
                    style={{
                      padding: '0.2rem 0.2rem',
                      background: 'none',
                      color: 'white',
                      border: '1px solid #FF6666',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.4rem',
                      fontWeight: 'bold',

                    }}

                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="" style={{ marginRight: '10px' }}>
              Total Messages: {message.length}
            </div>
            {message.length > 0 && (
              <button
                className=""
                onClick={handleDeleteAllMessages}
                style={{
                  padding: '0.5rem 0.6rem',
                  background: 'none',
                  color: '#FF6666',
                  border: '1px solid #FF6666',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.6rem',
                  fontWeight: 'bold',
                }}
              >
                Delete All
              </button>
            )}
          </div>
        </div>

        <button onClick={handleClick} style={{
          padding: '0.5rem 0.6rem',
          color: 'white',
          background: 'none',
          border: '1px solid #22C55E',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontSize: '0.6rem',
          fontWeight: 'bold',
        }}
        >Subscribe Message</button>
      </div>
    </div>
  );
};

export default SubscribeNode;