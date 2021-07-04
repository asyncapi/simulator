const parser = require('@asyncapi/parser');
const filesystem = require('fs');
const Ajv = require('ajv');
const scenarioSpecs = require('../Schema');
const yamlParser  = require('js-yaml');

const getPubScenariosFromAsyncFile = (parserContext,key,value) => {
  if (value._json['x-plot']) {
    parserContext.PublishOperations.soloOps[value._json['x-plot']] = Object.assign({}, value.publish()._json, {route: key});
  }
  if (value._json['x-group']) {
    if (!parserContext.PublishOperations.groupOps[value._json['x-group']]) {
      parserContext.PublishOperations.groupOps[value._json['x-group']] = {};
    }
    Object.assign(parserContext.PublishOperations.groupOps[value._json['x-group']], {[key]: value.publish()._json});
  }
  return parserContext;
};

const getSubScenariosFromAsyncFile = (parserContext,key,value) => {
  if (value._json['x-plot']) {
    parserContext.SubscribeOperations.soloOps[value._json['x-plot']] = Object.assign({}, value.subscribe()._json, {route: key});
  }
  if (value._json['x-group']) {
    if (!parserContext.SubscribeOperations.groupOps[value._json['x-group']]) {
      parserContext.SubscribeOperations.groupOps[value._json['x-group']] = {};
    }
    Object.assign(parserContext.SubscribeOperations.groupOps[value._json['x-group']], {[key]: value.subscribe()._json});
  }
  return parserContext;
};

const structureDataAsyncApi = (parserContext,asyncApiParsed) => {
  let contextWithOperation;
  for (const [key, value] of Object.entries(asyncApiParsed.channels())) {
    if (!!parserContext.PublishOperations.soloOps[value._json['x-plot']] ||
        !!parserContext.SubscribeOperations.soloOps[value._json['x-plot']]) {
      console.log(`\nError solo scenario key: ${key} was specified more than one times.\nNon-group scenario keys (x-scenario) should be
      different in each channel`);
    }
    if (!!value.publish()) {
      contextWithOperation = getPubScenariosFromAsyncFile(parserContext,key,value);
    } else if (!!value.subscribe()) {
      contextWithOperation = getSubScenariosFromAsyncFile(parserContext,key,value);
    }
  }
  return contextWithOperation;
};

const structureDataScenario = (parserContext) => {
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
  return parserContext;
};

/**
 * Asynchronously parses the provided YAML or JSON file, creates object containing details about the operations
 * that can be executed.
 *
 *
 * @constructor
 * @param filepathAsyncApi
 * @param filepathScenario
 */
const scenarioParserAndConnector  = async (filepathAsyncApi, filepathScenario) => {
  const parserContext = this;
  parserContext.ready = false;
  const ajv = new Ajv();

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    parserContext.content = filesystem.readFileSync(filepathAsyncApi).toString();
  } catch (err) {
    console.log(`\nError in reading the asyncApi file. Details: ${err}`);
  }
  const asyncApiParsed = await parser.parse(parserContext.content);

  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    parserContext.scenario = filesystem.readFileSync(filepathScenario,{encoding: 'utf-8',flag: 'r'});
    parserContext.scenarioParsed = yamlParser.load(parserContext.scenario);
    const validate = ajv.compile(scenarioSpecs[parserContext.scenarioParsed.version]);
    if (!validate) {
      console.log('\nWrong or unavailable schema version be sure to check the spec for more info.');
    }
    const valid = validate(parserContext.scenarioParsed);
    if (!valid) {
      console.log(`\nError the provided scenario file does does not comply with the spec of version ${parserContext.scenarioParsed.version}\nDetails: `,validate.errors);
      process.emit('SIGINT');
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

  const parserContextNew = structureDataAsyncApi(parserContext,asyncApiParsed);
  
  const parserContextNew2 = structureDataScenario(parserContextNew);

  console.log(`\nFound ${Object.keys(parserContext.PublishOperations.soloOps).length +
  Object.keys(parserContext.PublishOperations.groupOps).length} testable Operations`);
  return parserContextNew2;
};
module.exports = { scenarioParserAndConnector};

