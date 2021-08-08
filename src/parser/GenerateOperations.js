const parser = require('@asyncapi/parser');
const filesystem = require('fs');
const Ajv = require('ajv');
const scenarioSpecs = require('../Schema');
const yamlParser  = require('js-yaml');

/**
 * Take a parsed asyncApi and scenario file and generates two objects that describe
 * publish and subscribe operations with the needed details for the request handler
 * be able to make requests.
 * @param asyncApiParsed
 * @param scenarioParsed
 * @returns {({groupOps: {}, soloOps: {}} | {groupOps: {}, soloOps: {}})[]}
 */
const GenerateOperations = (asyncApiParsed,scenarioParsed) => {
  const PublishOperations = {
    soloOps: {},
    groupOps: {}
  };
  const SubscribeOperations = {
    soloOps: {},
    groupOps: {}
  };
  for (const [key, value] of Object.entries(asyncApiParsed.channels())) {
    if (!!PublishOperations.soloOps[value._json['x-plot']] ||
        !!SubscribeOperations.soloOps[value._json['x-plot']]) {
      console.log(`\nError solo scenario key: ${key} was specified more than one times.\nNon-group scenario keys (x-scenario) should be
      different in each channel`);
    }
    if (!!value.publish()) {
      if (value._json['x-plot']) {
        PublishOperations.soloOps[value._json['x-plot']] = Object.assign({}, value.publish()._json, {route: key});
      }
      if (value._json['x-group']) {
        if (!PublishOperations.groupOps[value._json['x-group']]) {
          PublishOperations.groupOps[value._json['x-group']] = {};
        }
        Object.assign(PublishOperations.groupOps[value._json['x-group']], {[key]: value.publish()._json});
      }
    } else if (!!value.subscribe()) {
      if (value._json['x-plot']) {
        SubscribeOperations.soloOps[value._json['x-plot']] = Object.assign({}, value.subscribe()._json, {route: key});
      }
      if (value._json['x-group']) {
        if (!SubscribeOperations.groupOps[value._json['x-group']]) {
          SubscribeOperations.groupOps[value._json['x-group']] = {};
        }
        Object.assign(SubscribeOperations.groupOps[value._json['x-group']], {[key]: value.subscribe()._json});
      }
    }
  }

  for (const [key,value] of Object.entries(scenarioParsed)) {
    if (key.match(RegExp(/^group-[\w\d]+$/),'g')) {
      const groupId = key.match(RegExp(/[\w\d]+$/),'g');
      const eps = value.eps;
      if (PublishOperations.groupOps.hasOwnProperty(groupId[0])) {
        Object.assign(PublishOperations.groupOps[groupId[0]],{eventsPsec: eps});
      }
    } else if (key.match(RegExp(/^plot-[\w\d]+$/),'g')) {
      const plotId = key.match(RegExp(/[\w\d]+$/,'g'));
      const eps = value.eps;
      const parameters = value.parameters;
      const payload = value.payload;
      if (PublishOperations.soloOps.hasOwnProperty(plotId[0])) {
        Object.assign(PublishOperations.soloOps[plotId[0]],{eventsPsec: eps,parameters,payload});
      }
    }
  }
  return [PublishOperations,SubscribeOperations];
};

module.exports = {GenerateOperations};
     