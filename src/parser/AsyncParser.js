const parser = require('@asyncapi/parser');
const filesystem = require('fs');

/**
 * Asynchronously Parses the provided yaml or json file .
 *
 *
 * @param filepath The path of the async-api spec file.
 * @constructor
 */
const AsyncParser  =  (filepath, opts) => {
  const parserContext = this;
  parserContext.ready = false;

  async function mapAsyncApiToHandler() {
    try {
      parserContext.content = filesystem.readFileSync(filepath).toString();
    } catch (err) {
      console.log(`\nError in parsing the file. Details: ${err}`);
    }
    const parsed = await parser.parse(parserContext.content);
    parserContext.ready = true;
    parserContext.serverUrl = parsed._json.servers['production'].url;
    parserContext.productionServerInfo = parsed.servers();
    parserContext.PublishOperations = {};
    parserContext.SubscribeOperations = {};
    for (const [key,value] of Object.entries(parsed.channels())) {
      if (value.publish())  Object.assign(parserContext.PublishOperations ,{ [key]: value.publish()._json,
        ['plot-id']: value._json['x-plot'],
        ['plot-group']: value._json['x-group']});
      if (value.subscribe())  Object.assign(parserContext.SubscribeOperations ,{ [key]: value.subscribe()._json,
        ['plot-id']: value._json['x-plot'],
        ['plot-group']: value._json['x-group']});
    }
    console.log(`\nFound ${Object.keys(parserContext.PublishOperations).length} testable Operations`);
    return parserContext;
  }

  return {
    mapAsyncApiToHandler
  };
};

module.exports = {AsyncParser};

