const {HandlerFactory} = require('./HandlerFactory');
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
    } else if (!Object.keys(handlersList).some((protocolName) =>
      protocolName === selectedProtocol
    )) {
      console.log(`\nDemanded operations on unsupported protocol named ${selectedProtocol}`);
    }
  }

  return {
    handlersList,
    createReqHandler,
    startOperations
  };
}

module.exports = {RequestManager};
