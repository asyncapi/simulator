const {HandlerFactory} = require('./HandlerFactory');
function RequestManager () {
  const handlersList = {};

  async function createReqHandler(dataFromParser) {
    for (const [name,data] of Object.entries(dataFromParser.servers)) {
      const instance = await HandlerFactory(data , dataFromParser.PublishOperations);
      handlersList[name] = instance;
    }
  }

  async function startOperations (id = 'all',protocol= 'undefined') {
    if (id === 'all' && protocol === 'undefined') {
      for (const value of Object.values(handlersList)) {
        await value.startSoloOperations();
      }
    } else  {

    }
  };

  return {
    handlersList,
    createReqHandler,
    startOperations
  };
}

module.exports = {RequestManager};
