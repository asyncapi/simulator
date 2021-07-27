const {mqttHandler} = require('./mqttHandler');
async function  HandlerFactory  (serverDat,operations,opts = {logging: false,saveLogs: false}) {
  if (serverDat.protocol === 'mqtt') {
    return  await mqttHandler(serverDat,operations);
  }
}

module.exports = {HandlerFactory};
