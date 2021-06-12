const parser = require('@asyncapi/parser/lib/index');
const filesystem = require('fs');

/**
 * Asynchronously Parses the provided yaml or json file .
 *
 *
 * @param filepath The path of the async-api spec file.
 * @constructor
 */
const AsyncParser  =  (filepath, opts) => {
  const that = this;
  that.ready = false;

  async function Parse() {
    try {
      that.content = filesystem.readFileSync(filepath).toString();
    } catch (err) {
      console.log(`\nError in parsing the file. Details: ${err}`);
    }
  }

  async function mapAsyncApiToHandler() {
    const parsed =await parser.parse(that.content);
    that.ready = true;
    that.serverUrl = parsed._json.servers['production'].url;
    that.productionServerInfo = parsed.servers();
    that.PublishOperations = {};
    that.SubscribeOperations = {};
    for (const [key,value] of Object.entries(parsed.channels())) {
      if (value.publish())  Object.assign(that.PublishOperations ,{ [key]: value.publish()});
      if (value.subscribe())  Object.assign(that.SubscribeOperations ,{ [key]: value.subscribe()});
    }
    console.log(`\nFound ${Object.keys(that.PublishOperations).length} testable Operations`);
  }

  return {
    Parse,
    mapAsyncApiToHandler
  };
};

module.exports = {AsyncParser};

