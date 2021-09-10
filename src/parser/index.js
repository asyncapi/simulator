const {generateOperationsAndScenarios}= require('./GenerateOperationsAndScenarios');
const {parseFiles} = require('./parseFiles');

function checkScenarioParamsValidity () {

}

function getParameterDefinitions(channels) {
  const paramDefinitions = {};
  for (const [channel,channelDetails] of Object.entries(channels)) {
    Object.assign(paramDefinitions,{[channel]: {}});
    for (const [paramName,paramValue] of Object.entries(channelDetails._json.parameters)) {
      // eslint-disable-next-line security/detect-object-injection
      Object.assign(paramDefinitions[channel],{[paramName]: paramValue});
    }
  }
  return paramDefinitions;
}

const parserAndGenerator = async (asyncApiFilepath,scenarioFilepath) => {
  const [asyncApiContent,scenarioContent] = await parseFiles(asyncApiFilepath,scenarioFilepath);
  const operationsData = {
    servers: asyncApiContent._json.servers,
    parameterDefinitions: {},
    operations: {

    },
    scenarios: {

    }
  };
  [operationsData.operations,operationsData.scenarios] = generateOperationsAndScenarios(asyncApiContent,scenarioContent);

  operationsData.parameterDefinitions = getParameterDefinitions(asyncApiContent.channels());

  console.log(`\nFound ${Object.keys(operationsData.scenarios).length} executable scenario/s`);
  return operationsData;
};

module.exports = parserAndGenerator;

