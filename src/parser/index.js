const {generateOperations}= require('./GenerateOperations');
const {parseFiles} = require('./parseFiles');

const parserAndGenerator = async (asyncApiFilepath,scenarioFilepath) => {
  const [asyncApiContent,scenarioContent] = await parseFiles(asyncApiFilepath,scenarioFilepath);
  const operationsData = {
    ready: true,
    servers: asyncApiContent._json.servers,
    publishOperations: {
      soloOps: {},
      groupOps: {}
    },
    subscribeOperations: {
      soloOps: {},
      groupOps: {}
    }
  };
  [operationsData.publishOperations,operationsData.subscribeOperations] = generateOperations(asyncApiContent,scenarioContent);

  console.log(`\nFound ${Object.keys(operationsData.publishOperations.soloOps).length +
  Object.keys(operationsData.publishOperations.groupOps).length} testable Operations`);
  return operationsData;
};

module.exports = parserAndGenerator;

