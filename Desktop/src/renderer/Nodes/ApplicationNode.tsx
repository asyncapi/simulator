import React from 'react';
import { Handle, Position } from 'reactflow';
import { AsyncAPIDocument } from '@asyncapi/parser';
import type { FunctionComponent } from 'react';

interface IData {
  spec: AsyncAPIDocument
}

interface IData {
  messages: any []
  channel: string
  description: string
  title:string
  version:string
  license:string
  externalDocs:string
  servers: string
  defaultContentType:string
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

  return (
    <div style={{ backgroundColor: 'white', padding: '10px' }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'gray' }}
      />
      <div>
        <div>
          <div>
            <span>
              application
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
      <Handle type="source" position={Position.Right} style={{ background: 'gray' }} />
    </div>
  );
};

export default ApplicationNode;