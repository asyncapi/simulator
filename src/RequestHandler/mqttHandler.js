const mqtt = require('async-mqtt');

function channelParamValidator(parameterDefininitions) {
  function validate (channel,paramName) {
    if (!parameterDefininitions[channel]) {
      return false;
    }
  }
  return {
    validate
  };
}

// eslint-disable-next-line sonarjs/cognitive-complexity
async function  mqttHandler (serverInfo,scenarios,parameterDefinitions) {
  const aliveOperations = {};
  let serverUrl;
  const paramValidator = channelParamValidator(parameterDefinitions);
  if (!!serverInfo.variables?.port) {
    serverUrl = serverInfo.url.replace('{port}' , serverInfo.variables.port.default);
  } else {
    serverUrl = serverInfo.url;
  }
  const client = await mqtt.connectAsync(`mqtt:${serverUrl}`);
  async function startScenario (scenario = 'all') {
    // for (const [id,value] of Object.entries(scenarios.soloOps)) {
    //   const parameters = value.parameters;
    //   let channelUrl = value.route;
    //   const urlParameters = channelUrl.match(new RegExp(/{(.*?)}/gm)).map((item) => item.substring(1,item.length-1));
    //   for (const [name,value] of Object.entries(parameters)) {
    //     if (urlParameters.some((item) => item === name)) {
    //       channelUrl = channelUrl.replace(`{${ name }}` , value);
    //     }
    //   }
    //   aliveOperations[parseInt(id, 10)] = setInterval(async () => {
    //     await client.publish(channelUrl, JSON.stringify(value.payload));
    //     console.log(channelUrl);
    //   },
    //   1000 / value.eventsPsec
    //   );
    // }
    for (const [scenarioName,scenarioOperations] of Object.entries(scenarios)) {
      for (const [operationName,operation] of scenarioOperations) {
        if (operation.loop) {
          const secsInterval = operation.loop.interval; 
          const loopCycles = operation.loop.cycles;
          for (const [channelName,channelDetails] of operation.loop) {
            // eslint-disable-next-line security/detect-unsafe-regex
            if (channelName.match(RegExp(/^(\/[^\/]+){0,4}\/?$/),'gm')) {
              const payload = {};
              const channelParams = {};
              for (const [propName,propValue] of channelDetails) {
                if (propName !== 'payload') {
                  payload = propValue;
                } else  {
                  channelParamValidator();
                  Object.assign(channelParams,{[propName]: propValue});
                }
              }
            }
          }
        } else {
          for (const [channelName,channelDetails] of operation) {

          }
        }
      }
    }
  }

  return {
    aliveOperations,
    startScenario
  };
}

module.exports = {mqttHandler};
