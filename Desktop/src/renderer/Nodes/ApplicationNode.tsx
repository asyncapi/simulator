import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { AsyncAPIDocument } from '@asyncapi/parser';
import type { FunctionComponent } from 'react';
import { ipcRenderer } from 'electron';

interface IData {
  spec: AsyncAPIDocument
}

interface IData {
  messages: any[]
  channel: string
  description: string
  title: string
  version: string
  license: string
  externalDocs: string
  servers: string
  defaultContentType: string
}

interface ApplicationNodeProps {
  data: IData
}

const buildNodeData = (spec: AsyncAPIDocument, extraData?: any) => {

  if (extraData) {
    return extraData;
  }

  const servers = spec.servers();


  const mappedServers = Object.keys(servers).reduce((newMappedServers: any[], serverKey) => {
    const server = servers[String(serverKey)];

    newMappedServers.push({
      name: serverKey,
      url: server.url(),
      description: server.description(),
      protocol: server.protocol(),
      protocolVersion: server.protocolVersion(),
    });
    return newMappedServers;
  }, []);

  const specInfo = spec.info();

  return {
    defaultContentType: spec.defaultContentType(),
    description: specInfo.description(),
    title: specInfo.title(),
    version: specInfo.version(),
    license: {
      name: specInfo.license() && specInfo.license()?.name(),
      url: specInfo.license() && specInfo.license()?.url(),
    },
    // @ts-ignore
    externalDocs: spec.externalDocs() && spec.externalDocs().url(),
    servers: mappedServers,
  };
};

export const ApplicationNode: FunctionComponent<ApplicationNodeProps> = ({
  data: {
    spec,
    description,
    title,
    version,
    license,
    externalDocs,
    servers,
    defaultContentType,
  },
}) => {

  let combinedData;

  if (spec) {
    const generatedData = buildNodeData(spec);
    combinedData = { ...generatedData };
  } else {
    combinedData = {
      description,
      title,
      version,
      license,
      externalDocs,
      servers,
      defaultContentType,
    };
  }

  const handleClick = () => {
    ipcRenderer.send('start-aedes');
  };

  const disconnectAedes = () => {
    ipcRenderer.send('stop-aedes');
  }

  useEffect(() => {
    return () => {
      ipcRenderer.send('stop-aedes');
    }
  }, [])

  const [isConnected, setIsConnected] = useState(false);

  return (
    <div style={{ margin: '0.7rem', maxWidth: '500px', padding: '1rem', border: '1px solid #F0E68C', borderRadius: '0.5rem', fontFamily: 'Arial, sans-serif', backgroundColor: 'rgba(255, 255, 153, 0.32)' }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#FFF799', width: '8px', height: '8px', }}
      />
      <div>
        <div>
          <div>
            <span style={{ letterSpacing: '0.05em', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              APPLICATION
            </span>
          </div>

          <div>
            <h3>{combinedData.title}</h3>
            <span>
              v{combinedData.version}
            </span>
          </div>
          {combinedData.description && (
            <div>
              {combinedData.description}
            </div>
          )}
          {combinedData.defaultContentType && (
            <p>
              Default ContentType:{' '}
              <span>
                {combinedData.defaultContentType}
              </span>
            </p>
          )}
        </div>
        <div>
          {combinedData.externalDocs && (
            <a
              href={combinedData.externalDocs}
              target="_blank"
              rel="noreferrer"
            >
              {combinedData.externalDocs}
            </a>
          )}

        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#FFF799', width: '8px', height: '8px', }} />
      {isConnected ? (
        <>
          <button
            type="button"
            style={{
              padding: '0.5rem 0.6rem',
              color: '#FFE9C0',
              background: 'none',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'grab',
              fontSize: '0.6rem',
              fontWeight: 'bold',
            }}
          >
            Connected
          </button>
          <button
            className="text-red-500 border border-red-500 rounded-full hover:bg-red-100 hover:border-red-300 focus:shadow-outline focus:outline-none py-1 px-3 ml-14"
            type="button"
            onClick={() => { setIsConnected(false); disconnectAedes() }}
            style={{
              color: 'lightgrey',
              border: '1px solid lightyellow',
              borderRadius: '99px',
              padding: '0.5rem 0.6rem',
              marginLeft: '1.5rem',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.6rem',
              fontWeight: 'bold',
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          style={{
            padding: '0.5rem 0.6rem',
            color: 'white',
            background: 'none',
            border: '1px solid #F0E68C',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.6rem',
            fontWeight: 'bold',
          }}
          type="button"
          onClick={() => {
            setIsConnected(true);
            handleClick();
          }}
        >
          Start Broker
        </button>
      )}

    </div>
  );
};

export default ApplicationNode;