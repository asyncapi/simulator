const mqtt = require('async-mqtt');
async function  mqttHandler (serverInfo,scenarios) {
  const aliveOperations = {};
  let serverUrl;

  if (!!serverInfo.variables?.port) {
    serverUrl = serverInfo.url.replace('{port}' , serverInfo.variables.port.default);
  } else {
    serverUrl = serverInfo.url;
  }
  const client = await mqtt.connectAsync(`mqtt:${serverUrl}`);
  async function startScenario (scenario = 'all') {
    for (const [id,value] of Object.entries(scenarios.soloOps)) {
      const parameters = value.parameters;
      let channelUrl = value.route;
      const urlParameters = channelUrl.match(new RegExp(/{(.*?)}/gm)).map((item) => item.substring(1,item.length-1));
      for (const [name,value] of Object.entries(parameters)) {
        if (urlParameters.some((item) => item === name)) {
          channelUrl = channelUrl.replace(`{${ name }}` , value);
        }
      }
      aliveOperations[parseInt(id, 10)] = setInterval(async () => {
        await client.publish(channelUrl, JSON.stringify(value.payload));
        console.log(channelUrl);
      },
      1000 / value.eventsPsec
      );
    }
  }

  return {
    aliveOperations,
    startScenario
  };
}

module.exports = {mqttHandler};
