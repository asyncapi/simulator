const assert = require('assert');
const expect = require('chai').expect;
const path = require('path');
const expectedOutputs = require('./expectedOutputs');
const {parseFiles} = require('../parseFiles');
describe('Parser Tests',function() {
  let asyncApi;
  it('Should be able to parse correctly formatted asyncApi and scenario files.',async function() {
    try {
      [asyncApi] = await parseFiles(path.resolve(__dirname, './files/correct/CorrectlyFormattedAsyncApi.yaml'), path.resolve(__dirname, './files/correct/CorrectlyFormattedScenario.yaml'));
    } catch (err) {
      assert.fail('Test failed. Parser was not able to parse one of the files you provided');
    }
    expect(asyncApi._json).to.deep.include(expectedOutputs.P1_AsyncApi._json);
  });
  it('Throws Error when parsing incorrectly formatted AsyncApi file.',async function () {
    let Error = {};
    try {
      await parseFiles(path.resolve(__dirname, './files/wrong/IncorrectlyFormattedAsyncApi.yaml'), path.resolve(__dirname, './files/correct/IncorrectlyFormattedScenario.yaml'));
    } catch (err) {
      Error = err;
    }
    expect(Error).to.be.a('Error');
    expect(Error.title).to.equal('The provided YAML is not valid.');
  });
});

