const asyncParser = require('@asyncapi/parser/lib/index')
const filesystem = require('fs')


/**
 * Asynchronously Parses the provided yaml or json file .
 *
 *
 * @param filepath The path of the async-api spec file.
 * @constructor
 */
const AsyncParser = async (filepath) => {
    var result = null;
    const apiFileContent = filesystem.readFileSync(String(filepath))
    const parsed = asyncParser.parse(apiFileContent.toString());
    await parsed.then((res) => {
        result = res
    }).catch((err) => {
        throw Error('Failed to parse provided file url make sure the file exists and complies to async-api spec')
    })
    return result;
}

module.exports = {AsyncParser}
