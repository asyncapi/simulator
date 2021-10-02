const {HandlerFactory} = require('./HandlerFactory');
const supportedProtocols = ['mqtt'];
function RequestManager () {
  const handlersList = {};

  async function createReqHandler(dataFromParser) {
    for (const [serverName,serverData] of Object.entries(dataFromParser.servers)) {
      let handlerInstance;
      try {
        handlerInstance = await HandlerFactory(serverData, dataFromParser.scenarios, dataFromParser.parameterDefinitions,dataFromParser.operations);
      } catch (err) {
        console.log(err);
        return;
      }

      handlersList[`${serverName}_${serverData.protocol}`] = handlerInstance;
    }
  }

  async function startOperation (operationName = 'all',selectedProtocol= 'undefined') {
    if (operationName === 'all' && selectedProtocol === 'undefined' && handlersList !== {}) {
      for (const value of Object.values(handlersList)) {
        await value.startOperations(operationName);
      }
    } else if (!supportedProtocols.some((protocolName) => protocolName === selectedProtocol)) {
      console.log(`\nThe protocol ${selectedProtocol} you demanded to be used for operations is not currently supported.`);
    } else if (!Object.keys(handlersList).some((protocolName) => protocolName === selectedProtocol)) {
      console.log(`\nThe protocol ${selectedProtocol} you demanded to be used for operations is not used in any of your defined servers.`);
    } else  {
      console.log(`\nThe protocol ${selectedProtocol} you demanded to be used for operations is badly defined or unknown.`);
    }
  }

  async function startScenario (scenarioName = 'all', selectedProtocol = 'undefined') {
    if (scenarioName === 'all' && selectedProtocol === 'undefined' && handlersList !== {}) {
      for (const value of Object.values(handlersList)) {
        await value.startScenario(scenarioName);
      }
    } else if (!supportedProtocols.some((protocolName) => protocolName === selectedProtocol)) {
      console.log(`\nThe protocol ${selectedProtocol} you demanded to be used for operations is not currently supported.`);
    } else if (!Object.keys(handlersList).some((protocolName) => protocolName === selectedProtocol)) {
      console.log(`\nThe protocol ${selectedProtocol} you demanded to be used for operations is not used in any of your defined servers.`);
    } else  {
      console.log(`\nThe protocol ${selectedProtocol} you demanded to be used for operations is badly defined or unknown.`);
    }
  }

  return {
    handlersList,
    createReqHandler,
    startOperation,
    startScenario
  };
}

module.exports = {RequestManager};
