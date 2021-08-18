const assert = require('assert');
const expect = require('chai').expect;
const path = require('path');
const expectedOutputs = require('./expectedOutputs');
const {parseFiles} = require('../parseFiles');
describe('Parser',function() {
  let asyncApi;
  it('Should be able to parse correctly formatted AsyncAPI and scenario files',async function() {
    try {
      [asyncApi] = await parseFiles(path.resolve(__dirname, './files/correct/CorrectlyFormattedAsyncApi.yaml'), path.resolve(__dirname, './files/correct/CorrectlyFormattedScenario.yaml'));
    } catch (err) {
      assert.fail('Test failed. Parser was not able to parse one of the files you provided');
    }
    expect(asyncApi._json).to.deep.include(expectedOutputs.p1AsyncApi._json);
  });
  it('Should throw error when parsing incorrectly formatted AsyncAPI file',async function () {
    let error = {};
    try {
      await parseFiles(path.resolve(__dirname, './files/wrong/IncorrectlyFormattedAsyncApi.yaml'), path.resolve(__dirname, './files/correct/IncorrectlyFormattedScenario.yaml'));
    } catch (err) {
      error = err;
    }
    expect(error).to.be.a('Error');
    expect(error.title).to.equal('The provided YAML is not valid.');
  });
});

