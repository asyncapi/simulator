const {mqttHandler} = require('./mqttHandler');
async function  HandlerFactory  (serverDat,operations,opts = {logging: false,saveLogs: false}) {
  if (opts.logging === true) {

  }
  if (opts.saveLogs === true) {

  }
  if (serverDat.protocol === 'mqtt') {
    return  await mqttHandler(serverDat,operations);
  }
}

module.exports = {HandlerFactory};
