const mqtt = require('async-mqtt');

async function  mqttHandler (serverInfo,operations) {
  const aliveOperations = {};

  const url = serverInfo.url.replace('{port}',serverInfo.variables.port.default);
  const client  = await mqtt.connectAsync(`mqtt:${url}`);

  async function startSoloOperations () {
    for (const [id,value] of Object.entries(operations.soloOps)) {
      const interval = setInterval(async () => {
        await client.publish(value.route , JSON.stringify({
          test: 1
        }));
        console.log(value.route);
      },
      1000
      );
      aliveOperations[id] = interval;
    }
  }

  async function startOperation_id (id) {

  }

  // mqttHandler.on('end_simulation',async () => {
  //   await client.end();
  // });
  // mqttHandler.on('error',async (err) => {
  //   console.log('\nError on mqttHandler',err);
  //   await client.end();
  // });

  return {
    aliveOperations,
    startSoloOperations,
    startOperation_id
  };
}

module.exports = {mqttHandler};
