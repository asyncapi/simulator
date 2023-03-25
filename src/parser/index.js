const {getParameterDefinitions, getDefinedChannels, generateOperations, generateScenarios } = require('./dataTypesGenerator');

const cliInterface =  (asyncApiContent,scenarioContent,basedir) => {
  const channels = {
    publish: {},
    subscribe: {}
  };

  const operationsData = {
    servers: asyncApiContent._json.servers,
    parameterDefinitions: {},
    operations: {

    },
    scenarios: {

    }
  };

  [channels.publish,channels.subscribe] = getDefinedChannels(asyncApiContent.channels());

  operationsData.operations = generateOperations(scenarioContent);

  operationsData.scenarios = generateScenarios(scenarioContent,operationsData.operations);

  operationsData.parameterDefinitions = getParameterDefinitions(asyncApiContent.channels());

  console.log(`\nFound ${Object.keys(operationsData.scenarios).length} executable scenario/s`);
  return {operationsData

  };
};

const desktopAppInterface = async (asyncApiContent,scenarioContent,basedir) => {

};

module.exports = {cliInterface,desktopAppInterface};
