const {HandlerFactory} = require('./HandlerFactory');
const supportedProtocols = ['mqtt'];
function RequestManager () {
  const handlersList = {};

  async function createReqHandler(dataFromParser) {
    for (const [serverName,serverData] of Object.entries(dataFromParser.servers)) {
      let handlerInstance;
      try {
        handlerInstance = await HandlerFactory(serverData, dataFromParser.scenarios);
      } catch (err) {
        console.log(err);
        return;
      }

      handlersList[parseInt(serverName, 10)] = handlerInstance;
    }
  }

  async function startOperations (id = 'all',selectedProtocol= 'undefined') {
    if (id === 'all' && selectedProtocol === 'undefined' && handlersList !== {}) {
      for (const value of Object.values(handlersList)) {
        await value.startSoloOperations();
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
    startOperations
  };
}

module.exports = {RequestManager};
