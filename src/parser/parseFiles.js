const parser = require('@asyncapi/parser');
const filesystem = require('fs');
const Ajv = require('ajv');
const scenarioSpecs = require('../Schema');
const yamlParser  = require('js-yaml');

const ajv = new Ajv({allowMatchingProperties: true,strict: true,allErrors: true, verbose: true});

/**
 * Parses asyncApi and scenario files.
 * @param filepathAsyncApi
 * @param filepathScenario
 * @returns {Promise<(*|*|string|Chai.Assertion)[]>}
 */
const parseFiles  = async (filepathAsyncApi, filepathScenario,basedir) => {
  let asyncApiContent;
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    asyncApiContent = filesystem.readFileSync(filepathAsyncApi).toString();
  } catch (err) {
    console.log(`\nError in reading the asyncApi file. Details: ${err}`);
  }
  const asyncApiParsed = await parser.parse(asyncApiContent, {path: basedir});
  let scenarioParsed;
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const scenario = filesystem.readFileSync(String(filepathScenario),{encoding: 'utf-8',flag: 'r'});
    if (filepathAsyncApi.match(/.yaml$/)) {
      scenarioParsed = yamlParser.load(scenario);
    } else {
      scenarioParsed = JSON.parse(scenario);
    }
    const validate = ajv.compile(scenarioSpecs[scenarioParsed.version]);
    if (!validate) {
      console.log('\nWrong or unavailable schema version be sure to check the spec for more info.');
    }
    const valid = ajv.validate(scenarioSpecs[scenarioParsed.version],scenarioParsed);
    if (!valid) {
      console.log(`\nError the provided scenario file does does not comply with the spec of version ${scenarioParsed.version}\nDetails: `,validate.errors);
      process.emit('SIGINT');
    }
  } catch (err) {
    console.log('\nError in parsing the scenario file. Make sure you have set the version property to a valid version.');
  }
  return [asyncApiParsed,scenarioParsed];
};

const parseScenario  = async (scenarioContent) => {
  const scenarioParsed = JSON.parse(scenarioContent);
  const validate = ajv.compile(scenarioSpecs[scenarioParsed.version]);
  if (!validate) {
    console.log('\nWrong or unavailable schema version be sure to check the spec for more info.');
  }
  const valid = ajv.validate(scenarioSpecs[scenarioParsed.version],scenarioParsed);
  if (!valid) {
    console.log(`\nError the provided scenario file does does not comply with the spec of version ${scenarioParsed.version}\nDetails: `,validate.errors);
    process.emit('SIGINT');
  }
};

const parseAsyncApi  = async (ayncApiContent,basedir) => {
  return await parser.parse(ayncApiContent, {path: basedir});
};

module.exports = {parseFiles,parseScenario,parseAsyncApi};
