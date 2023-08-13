import React from 'react';
import { Handle, Position } from 'reactflow';
import { AsyncAPIDocument } from '@asyncapi/parser';
import type { FunctionComponent } from 'react';

interface IData {
  spec: AsyncAPIDocument
}

interface ApplicationNodeProps {
  data: IData
}

const buildNodeData = (spec: AsyncAPIDocument) => {
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
  data: { spec } = {},
}) => {

  const { description, title, version, license, externalDocs, servers, defaultContentType } = buildNodeData(spec as AsyncAPIDocument);

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
            <h3>{title}</h3>
            <span>
              v{version}
            </span>
          </div>
          {description && (
            <div>
                {description}
            </div>
          )}
          {defaultContentType && (
            <p>
              Default ContentType:{' '}
              <span>
                {defaultContentType}
              </span>
            </p>
          )}
        </div>

        {servers.length > 0 && (
          <div>
            <h3>Servers</h3>
            <dl>
              {servers.map((server) => {
                return (
                  <div key={server.name}>
                    <dt>
                      {server.name}
                      <span>
                        {server.protocolVersion
                          ? `${server.protocol} ${server.protocolVersion}`
                          : server.protocol}
                      </span>
                    </dt>
                    <dd>
                      {/* <Markdown> */}
                        {server.description}
                      {/* </Markdown> */}
                    </dd>
                    <dd>url: {server.url}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        )}

        <div>
          {externalDocs && (
            <a
              href={externalDocs}
              target="_blank"
              rel="noreferrer"
            >
              {externalDocs}
            </a>
          )}
          {license.name && (
            <a
              href={license.url as string}
              target="_blank"
              rel="noreferrer"
            >
              License: {license.name}
            </a>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: 'gray' }} />
    </div>
  );
};

export default ApplicationNode;