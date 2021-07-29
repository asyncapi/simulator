const mqtt = require('async-mqtt');
async function  mqttHandler (serverInfo,operations) {
  const aliveOperations = {};
  let url;

  if (!!serverInfo.variables?.port) {
    url = serverInfo.url.replace('{port}' , serverInfo.variables.port.default);
  } else {
    url = serverInfo.url;
  }
  const client = await mqtt.connectAsync(`mqtt:${url}`);
  async function startSoloOperations () {
    for (const [id,value] of Object.entries(operations.soloOps)) {
      const parameters = value.parameters;
      let channelUrl = value.route;
      const urlParameters = channelUrl.match(new RegExp(/{(.*?)}/gm)).map((item) => item.substring(1,item.length-1));
      for (const [name,value] of Object.entries(parameters)) {
        if (urlParameters.some((item) => item === name)) {
          channelUrl = channelUrl.replace(`{${ name }}` , value);
        }
      }
      aliveOperations[parseInt(id, 10)] = setInterval(async () => {
        await client.publish(channelUrl , JSON.stringify(value.payload));
        console.log(channelUrl);
      } ,
      1000 / value.eventsPsec
      );
    }
  }

  return {
    aliveOperations,
    startSoloOperations
  };
}

module.exports = {mqttHandler};
