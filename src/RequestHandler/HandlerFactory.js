const {mqttHandler} = require('./mqttHandler');

async function  HandlerFactory  (serverData,scenarios= {logging: false,saveLogs: false},parameterDefinitions,operations) {
  if (serverData.protocol === 'mqtt') {
    return await mqttHandler(serverData,scenarios,parameterDefinitions,operations);
  }
  throw new Error(`\n${serverData.protocol} protocol is not supported.\nList of supported protocols:\n•mqtt`);
}

module.exports = {HandlerFactory};
