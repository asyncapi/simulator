import { useState} from 'react';
import { Handle, Position } from 'reactflow';

import type { FunctionComponent } from 'react';
import React from 'react';

interface IData {
  messages: any []
  channel: string
  description: string
}

interface PublishNodeProps {
  data: IData
}

export const SubscribeNode: FunctionComponent<PublishNodeProps> = ({ data: { channel, description, messages } }) => {

  return (
    <div style={{ backgroundColor: 'white', padding: '10px' }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'green' }}
      />
      <div>
        <div>
          <span>
            You can subscribe
          </span>
         
        </div>
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
      <Handle type="source" position={Position.Left} id="a" style={{ background: 'orange' }} />
    </div>
  );
};

export default SubscribeNode;