const {generateOperationsAndScenarios}= require('./GenerateOperations');
const {parseFiles} = require('./parseFiles');

const parserAndGenerator = async (asyncApiFilepath,scenarioFilepath) => {
  const [asyncApiContent,scenarioContent] = await parseFiles(asyncApiFilepath,scenarioFilepath);
  const operationsData = {
    servers: asyncApiContent._json.servers,
    operations: {

    },
    scenarios: {

    }
  };
  [operationsData.operations,operationsData.scenarios] = generateOperationsAndScenarios(asyncApiContent,scenarioContent);

  console.log(`\nFound ${Object.keys(operationsData.scenarios).length} executable scenario/s`);
  return operationsData;
};

module.exports = parserAndGenerator;

