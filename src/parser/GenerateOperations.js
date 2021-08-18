// eslint-disable-next-line sonarjs/cognitive-complexity
function operationsFromChannels (channels,publishOperations,subscribeOperations) {
  for (const [key, value] of Object.entries(channels)) {
    if (!!publishOperations.soloOps[value._json['x-plot']] ||
        !!subscribeOperations.soloOps[value._json['x-plot']]) {
      console.log(`\nError solo scenario key: ${key} was specified more than one times.\nNon-group scenario keys (x-scenario) should be
      different in each channel`);
    }
    if (!!value.publish()) {
      if (value._json['x-plot']) {
        publishOperations.soloOps[value._json['x-plot']] = Object.assign({}, value.publish()._json, {route: key});
      }
      if (value._json['x-group']) {
        if (!publishOperations.groupOps[value._json['x-group']]) {
          publishOperations.groupOps[value._json['x-group']] = {};
        }
        Object.assign(publishOperations.groupOps[value._json['x-group']], {[key]: value.publish()._json});
      }
    } else if (!!value.subscribe()) {
      if (value._json['x-plot']) {
        subscribeOperations.soloOps[value._json['x-plot']] = Object.assign({}, value.subscribe()._json, {route: key});
      }
      if (value._json['x-group']) {
        if (!subscribeOperations.groupOps[value._json['x-group']]) {
          subscribeOperations.groupOps[value._json['x-group']] = {};
        }
        Object.assign(subscribeOperations.groupOps[value._json['x-group']], {[key]: value.subscribe()._json});
      }
    }
  }
}

function operationsScenarioMutator (scenario,publishOperations) {
  for (const [key,value] of Object.entries(scenario)) {
    if (key.match(RegExp(/^group-[\w\d]+$/),'g')) {
      const groupId = key.match(RegExp(/[\w\d]+$/),'g');
      const eps = value.eps;
      if (publishOperations.groupOps.hasOwnProperty(groupId[0])) {
        Object.assign(publishOperations.groupOps[groupId[0]],{eventsPsec: eps});
      }
    } else if (key.match(RegExp(/^plot-[\w\d]+$/),'g')) {
      const plotId = key.match(RegExp(/[\w\d]+$/,'g'));
      const eps = value.eps;
      const parameters = value.parameters;
      const payload = value.payload;
      if (publishOperations.soloOps.hasOwnProperty(plotId[0])) {
        Object.assign(publishOperations.soloOps[plotId[0]],{eventsPsec: eps,parameters,payload});
      }
    }
  }
}
/**
 * Take a parsed asyncApi and scenario file and generates two objects that describe
 * publish and subscribe operations with the needed details for the request handler
 * be able to make requests.
 * @param asyncApiParsed
 * @param scenarioParsed
 * @returns {({groupOps: {}, soloOps: {}} | {groupOps: {}, soloOps: {}})[]}
 */
const generateOperations = (asyncApiParsed, scenarioParsed) => {
  const sublishOperations = {
    soloOps: {},
    groupOps: {}
  };
  const subscribeOperations = {
    soloOps: {},
    groupOps: {}
  };

  operationsFromChannels(asyncApiParsed.channels(),sublishOperations,subscribeOperations);

  operationsScenarioMutator(scenarioParsed,sublishOperations);

  return [sublishOperations,subscribeOperations];
};

module.exports = {generateOperations};
     