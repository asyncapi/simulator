const {getParameterDefinitions, getDefinedChannels, generateOperations, generateScenarios } = require('./GenerateOperationsAndScenarios');
const { parseAsyncApi, parseScenario } = require('./parseFiles');

/**
 *
 * @returns {{updateCliData: updateCliData, channels: {subscribe: {}, publish: {}}, operationsData: {servers: {}, operations: {}, parameterDefinitions: {}, scenarios: {}}}}
 * @param asyncApiContent
 * @param scenarioContent
 * @param basedir
 */
const cliInterface =  (asyncApiContent,scenarioContent,basedir) => {
  const channels = {
    publish: {},
    subscribe: {}
  };

  const operationsData = {
    servers: {},
    parameterDefinitions: {},
    operations: {

    },
    scenarios: {

    }
  };
  
  function updateCliData (asyncApiContent,scenarioContent) {
    [channels.publish,channels.subscribe] = getDefinedChannels(asyncApiContent.channels());

    operationsData.operations = generateOperations(scenarioContent);

    operationsData.servers = asyncApiContent._json.servers;

    operationsData.scenarios = generateScenarios(scenarioContent,operationsData.operations);

    operationsData.parameterDefinitions = getParameterDefinitions(asyncApiContent.channels());

    console.log(`\nFound ${Object.keys(operationsData.scenarios).length} executable scenario/s`);
  }

  return {
    channels,operationsData,updateCliData
  };
};

/**
 *
 * @param asyncApiContent
 * @param scenarioContent
 * @param basedir
 * @returns {Promise<{channels: {subscribe: {}, publish: {}}, updateAppData: updateAppData, operationsData: {servers: {}, operations: {}, parameterDefinitions: {}, scenarios: {}}, checkSyntax: ((function(): (*|string))|*)}>}
 */
const desktopAppInterface = async (asyncApiContent,scenarioContent,basedir) => {
  const channels = {
    publish: {},
    subscribe: {}
  };

  const operationsData = {
    servers: {},
    parameterDefinitions: {},
    operations: {

    },
    scenarios: {

    }
  };

  function checkSyntax () {
    try {
      parseScenario(scenarioContent);
    } catch (err) {
      return err;
    }
    return 'ok';
  }
  
  function updateAppData (asyncApiContent,scenarioContent) {
    const parsedAsyncApi = parseAsyncApi(asyncApiContent);
      
    [channels.publish,channels.subscribe] = getDefinedChannels(parsedAsyncApi.channels());

    const scenarioParsed = parseScenario(scenarioContent);
    operationsData.operations = generateOperations(scenarioParsed);

    operationsData.servers = parsedAsyncApi._json.servers;

    operationsData.scenarios = generateScenarios(scenarioParsed,operationsData.operations);

    operationsData.parameterDefinitions = getParameterDefinitions(asyncApiContent.channels());

    console.log(`\nFound ${Object.keys(operationsData.scenarios).length} executable scenario/s`);
  }

  return {
    channels,operationsData,updateAppData,checkSyntax
  };
};

module.exports = {cliInterface,desktopAppInterface};
