const {mqttHandler} = require('./mqttHandler');

async function  HandlerFactory  (serverData,scenarios,parameterDefinitions,operations) {
  if (serverData.protocol === 'mqtt') {
    return mqttHandler(serverData,scenarios,parameterDefinitions,operations);
  }
  throw new Error(`\n${serverData.protocol} protocol is not supported.\nList of supported protocols:\n•mqtt`);
}

module.exports = {HandlerFactory};
