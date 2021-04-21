const parser = require('@asyncapi/parser/lib/index')

const filesystem = require('fs').promises


/**
 * Asynchronously Parses the provided yaml or json file .
 *
 *
 * @param filepath The path of the async-api spec file.
 * @constructor
 */
const AsyncParser = async (filepath) => {
    const  apiFileContent = filesystem.readFile(String(filepath)).catch((err)=>{console.log('Error Reading spec file'+err)})
    const res = await apiFileContent
    const parsed =  parser.parse(res.toString());
    return parsed;
}

module.exports = {AsyncParser}
