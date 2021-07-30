const {HandlerFactory} = require('./HandlerFactory');
const supportedProtocols = ['mqtt'];
function RequestManager () {
  const handlersList = {};

  async function createReqHandler(dataFromParser) {
    for (const [name,data] of Object.entries(dataFromParser.servers)) {
      handlersList[parseInt(name, 10)] = await HandlerFactory(data , dataFromParser.PublishOperations);
    }
  }

  async function startOperations (id = 'all',selectedProtocol= 'undefined') {
    if (id === 'all' && selectedProtocol === 'undefined') {
      for (const value of Object.values(handlersList)) {
        await value.startSoloOperations();
      }
    } else if (!supportedProtocols.some((protocolName) => protocolName === selectedProtocol)) {
      console.log(`\nThe protocol ${selectedProtocol} you demanded to be used for operations is not currently supported.`);
    } else if (!Object.keys(handlersList).some((protocolName) =>
      protocolName === selectedProtocol
    )) {
      console.log(`\nThe protocol ${selectedProtocol} you demanded to be used for operations is not used in any of your defined servers.`);
    }
  }

  return {
    handlersList,
    createReqHandler,
    startOperations
  };
}

module.exports = {RequestManager};
