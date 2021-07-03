const parser = require('@asyncapi/parser');
const filesystem = require('fs');
const Ajv = require('ajv');
const scenarioSpecs = require('../Schema');
const yamlParser  = require('js-yaml');
/**
 * Asynchronously parses the provided YAML or JSON file.
 *
 *
 * @param filepathAsyncApi The path of the async-api spec file.
 * @param filepathScenario
 * @param opts Options regarding logging and error output
 * @constructor
 */
const scenarioParserAndConnector  = async (filepathAsyncApi, filepathScenario,opts) => {
  const parserContext = this;
  parserContext.ready = false;
  const ajv = new Ajv();

  try {
    parserContext.content = filesystem.readFileSync(filepathAsyncApi).toString();
  } catch (err) {
    console.log(`\nError in reading the asyncApi file. Details: ${err}`);
  }
  const asyncApiParsed = await parser.parse(parserContext.content);

  try {
    parserContext.scenario = filesystem.readFileSync(filepathScenario,{encoding: 'utf-8',flag: 'r'});
    parserContext.scenarioParsed = yamlParser.load(parserContext.scenario);
    const validate = ajv.compile(scenarioSpecs[parserContext.scenarioParsed.version]);
    if (!validate) {
      throw Error('\nWrong or unavailable schema version be sure to check the spec for more info.');
    }
    const valid = validate(parserContext.scenarioParsed);
    if (!valid) {
      console.log(validate.errors);
    }
  } catch (err) {
    console.log(`\nError in parsing the scenario file. Details:${err}`);
  }

  parserContext.ready = true;
  parserContext.serverUrl = asyncApiParsed._json.servers['production'].url;
  parserContext.productionServerInfo = asyncApiParsed.servers();
  parserContext.PublishOperations = {
    soloOps: {},
    groupOps: {}
  };
  parserContext.SubscribeOperations = {
    soloOps: {},
    groupOps: {}
  };

  for (const [key, value] of Object.entries(asyncApiParsed.channels())) {
    if (!!parserContext.PublishOperations.soloOps[value._json['x-plot']] ||
        parserContext.SubscribeOperations.soloOps[value._json['x-plot']]) {
      console.log(`\nError scenario key: ${key} was specified more than one times.\nNon-group scenario keys (x-scenario) should be
      different in each channel`);
    }
    if (!!value.publish()) {
      if (value._json['x-plot']) {
        parserContext.PublishOperations.soloOps[value._json['x-plot']] = Object.assign({}, value.publish()._json, {route: key});
      }
      if (value._json['x-group']) {
        if (!parserContext.PublishOperations.groupOps[value._json['x-group']]) {
          parserContext.PublishOperations.groupOps[value._json['x-group']] = {};
        }
        Object.assign(parserContext.PublishOperations.groupOps[value._json['x-group']], {[key]: value.publish()._json});
      }
    } else if (!!value.subscribe()) {
      if (value._json['x-plot']) {
        parserContext.SubscribeOperations.soloOps[value._json['x-plot']] = Object.assign({}, value.subscribe()._json, {route: key});
      }
      if (value._json['x-group']) {
        if (!parserContext.SubscribeOperations.groupOps[value._json['x-group']]) {
          parserContext.SubscribeOperations.groupOps[value._json['x-group']] = {};
        }
        Object.assign(parserContext.SubscribeOperations.groupOps[value._json['x-group']], {[key]: value.subscribe()._json});
      }
    }
  }
  
  for (const [key,value] of Object.entries(parserContext.scenarioParsed)) {
    if (key.match(RegExp(/^group-[\w\d]+$/),'g')) {
      const groupId = key.match(RegExp(/[\w\d]+$/),'g');
      const eps = value.eps;
      if (parserContext.PublishOperations.groupOps.hasOwnProperty(groupId[0])) {
        Object.assign(parserContext.PublishOperations.groupOps[groupId[0]],{eventsPsec: eps});
      }
    } else if (key.match(RegExp(/^plot-[\w\d]+$/),'g')) {
      const plotId = key.match(RegExp(/[\w\d]+$/,'g'));
      const eps = value.eps;
      if (parserContext.PublishOperations.soloOps.hasOwnProperty(plotId[0])) {
        Object.assign(parserContext.PublishOperations.soloOps[plotId[0]],{eventsPsec: eps});
      }
    }
  }
  console.log(`\nFound ${Object.keys(parserContext.PublishOperations.soloOps).length +
  Object.keys(parserContext.PublishOperations.groupOps).length} testable Operations`);
  return parserContext;
};
module.exports = { scenarioParserAndConnector};

