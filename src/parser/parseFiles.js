const parser = require('@asyncapi/parser');
const filesystem = require('fs');
const Ajv = require('ajv');
const scenarioSpecs = require('../Schema');
const yamlParser  = require('js-yaml');
/**
 * Parses asyncApi and scenario files.
 * @param filepathAsyncApi
 * @param filepathScenario
 * @returns {Promise<(*|*|string|Chai.Assertion)[]>}
 */
const parseFiles  = async (filepathAsyncApi, filepathScenario) => {
  const ajv = new Ajv();
  let asyncApiContent;
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    asyncApiContent = filesystem.readFileSync(filepathAsyncApi).toString();
  } catch (err) {
    console.log(`\nError in reading the asyncApi file. Details: ${err}`);
  }
  const asyncApiParsed = await parser.parse(asyncApiContent);

  let scenarioParsed;
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const scenario = filesystem.readFileSync(filepathScenario,{encoding: 'utf-8',flag: 'r'});
    scenarioParsed = yamlParser.load(scenario);
    const validate = ajv.compile(scenarioSpecs[scenarioParsed.version]);
    if (!validate) {
      console.log('\nWrong or unavailable schema version be sure to check the spec for more info.');
    }
    const valid = validate(scenarioParsed);
    if (!valid) {
      console.log(`\nError the provided scenario file does does not comply with the spec of version ${scenarioParsed.version}\nDetails: `,validate.errors);
      process.emit('SIGINT');
    }
  } catch (err) {
    console.log(`\nError in parsing the scenario file. Details:${err}`);
  }
  return [asyncApiParsed,scenarioParsed];
};

module.exports = {parseFiles};