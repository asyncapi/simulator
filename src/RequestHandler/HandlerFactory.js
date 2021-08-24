const {mqttHandler} = require('./mqttHandler');
async function  HandlerFactory  (serverDat,operations= {logging: false,saveLogs: false}) {
  if (serverDat.protocol === 'mqtt') {
    return  await mqttHandler(serverDat,operations);
  }
  throw new Error(`\n${serverDat.protocol} protocol is not supported.\nList of supported protocols:\n•mqtt`);
}

module.exports = {HandlerFactory};
