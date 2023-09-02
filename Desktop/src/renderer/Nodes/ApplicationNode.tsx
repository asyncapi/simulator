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

  console.log('servers which does not exists',servers)

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

  console.log('aa gaya data', description,
  title,
  version,
  license,
  externalDocs,
  servers,
  defaultContentType,)

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

  console.log('combined wala deta',combinedData)

  // const { description, title, version, license, externalDocs, servers, defaultContentType } = buildNodeData(spec as AsyncAPIDocument);

  // return (
  //   <div style={{ backgroundColor: 'white', padding: '10px' }}>
  //     <Handle
  //       type="target"
  //       position={Position.Left}
  //       style={{ background: 'gray' }}
  //     />
  //     <div>
  //       <div>
  //         <div>
  //           <span>
  //             application
  //           </span>
  //         </div>

  //         <div>
  //           <h3>{combinedData.title}</h3>
  //           <span>
  //             v{combinedData.version}
  //           </span>
  //         </div>
  //         {combinedData.description && (
  //           <div>
  //               {combinedData.description}
  //           </div>
  //         )}
  //         {combinedData.defaultContentType && (
  //           <p>
  //             Default ContentType:{' '}
  //             <span>
  //               {combinedData.defaultContentType}
  //             </span>
  //           </p>
  //         )}
  //       </div>

  //       {combinedData.servers.length > 0 && (
  //         <div>
  //           <h3>Servers</h3>
  //           <dl>
  //             {combinedData.servers.map((server) => {
  //               return (
  //                 <div key={server.name}>
  //                   <dt>
  //                     {server.name}
  //                     <span>
  //                       {server.protocolVersion
  //                         ? `${server.protocol} ${server.protocolVersion}`
  //                         : server.protocol}
  //                     </span>
  //                   </dt>
  //                   <dd>
  //                     {/* <Markdown> */}
  //                       {server.description}
  //                     {/* </Markdown> */}
  //                   </dd>
  //                   <dd>url: {server.url}</dd>
  //                 </div>
  //               );
  //             })}
  //           </dl>
  //         </div>
  //       )}

  //       <div>
  //         {combinedData.externalDocs && (
  //           <a
  //             href={combinedData.externalDocs}
  //             target="_blank"
  //             rel="noreferrer"
  //           >
  //             {combinedData.externalDocs}
  //           </a>
  //         )}
  //         {combinedData.license.name && (
  //           <a
  //             href={combinedData.license.url as string}
  //             target="_blank"
  //             rel="noreferrer"
  //           >
  //             License: {combinedData.license.name}
  //           </a>
  //         )}
  //       </div>
  //     </div>
  //     <Handle type="source" position={Position.Right} style={{ background: 'gray' }} />
  //   </div>
  // );

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