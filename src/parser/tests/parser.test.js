const assert = require('assert');
const chai = require('chai');
const expect = require('chai').expect;
const path = require('path');
const expectedOutputS = require('./expectedOutputs');
const {GenerateOperations} = require('../GenerateOperations');
const {parseFiles} = require('../parseFiles');
describe('Parser Tests',function() {
  let asyncApi,scenario;
  it('1# Should be able to parse correctly formatted asyncApi and scenario files.',async function() {
    try {
      [asyncApi, scenario] = await parseFiles(path.resolve(__dirname, './correctFiles/CorrectlyFormattedAsyncApi.yaml'), path.resolve(__dirname, './correctFiles/CorrectlyFormattedScenario.yaml'));
    } catch (err) {
      assert.fail('Test failed. Parser was not able to parse one of the files you provided');
    }
    expect(asyncApi._json).to.deep.include(expectedOutputS.P1_AsyncApi._json);
  });
  it('2# Throws Error when parsing incorrectly formatted AsyncApi file.',async function () {
    let Error = null;
    try {
      const [asyncApi, scenario] = await parseFiles(path.resolve(__dirname, './wrongFiles/IncorrectlyFormattedAsyncApi.yaml'), path.resolve(__dirname, './correctFiles/IncorrectlyFormatedScenario.yaml'));
    } catch (err) {
      Error = err;
    }
    expect(Error).to.be.a('Error');
    expect(Error.title).to.equal('The provided YAML is not valid.');
  });
});

