import React from 'react';
import { Handle, Position } from 'reactflow';


interface IData {
  messages: any[];
  channel: string
  description: string
}

interface PublishNodeProps {
  data: IData
}

export const PublishNode: React.FunctionComponent<PublishNodeProps> = ({
  data: { messages = [], channel, description },
}) => {

  return (
    <div style={{ backgroundColor: 'white', padding: '10px' }}>
      <div>
        <span>You can publish</span>
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
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: 'green' }}
        />
      </div>
    </div>
  );
};

export default PublishNode;