const {GenerateOperations}= require('./GenerateOperations');
const {parseFiles} = require('./parseFiles');

const parser = async (asyncApiFilepath,scenarioFilepath) => {
  const [asyncApiContent,scenarioContent] = await parseFiles(asyncApiFilepath,scenarioFilepath);
  const OperationsData = {
    ready: true,
    servers: asyncApiContent._json.servers,
    PublishOperations: {
      soloOps: {},
      groupOps: {}
    },
    SubscribeOperations: {
      soloOps: {},
      groupOps: {}
    }
  };
  [OperationsData.PublishOperations,OperationsData.SubscribeOperations] = GenerateOperations(asyncApiContent,scenarioContent);

  console.log(`\nFound ${Object.keys(OperationsData.PublishOperations.soloOps).length +
  Object.keys(OperationsData.PublishOperations.groupOps).length} testable Operations`);
  return OperationsData;
};

module.exports = parser;

