const {GenerateOperations} = require('../GenerateOperations');
const expect = require('chai').expect;
const {parseFiles} = require('../parseFiles');
const path = require('path');
describe('Operations Generator Tests',  function() {
  let PublishOperations,ScenarioOperations;
  let parsedAsyncApi,parsedScenario;
  before(async function() {
    [parsedAsyncApi, parsedScenario] = await parseFiles(path.resolve(__dirname,'./correctFiles/CorrectlyFormattedAsyncApi.yaml'), path.resolve(__dirname,'./correctFiles/CorrectlyFormattedScenario.yaml'));
  });
  const expectedPublishOperations = {
    soloOps: {
      1: {
        message: {
          payload: {
            type: 'object',
            $id: 'PlayerItemPickupPayload',
            additionalProperties: false,
            properties: {
              pickupTimestamp: {
                type: 'string',
                format: 'date-time',
                description: 'The timestamp the item was picked up',
                'x-parser-schema-id': '<anonymous-schema-4>'
              }
            }
          },
          'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0',
          'x-parser-original-payload': {
            type: 'object',
            $id: 'PlayerItemPickupPayload',
            additionalProperties: false,
            properties: {
              pickupTimestamp: {
                type: 'string',
                format: 'date-time',
                description: 'The timestamp the item was picked up'
              }
            }
          },
          schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0',
          'x-parser-message-parsed': true,
          'x-parser-message-name': '<anonymous-message-1>'
        },
        route: 'game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup',
        eventsPsec: 1,
        parameters: {
          serverId: '1',
          playerId: '5',
          itemId: '3'
        },
        payload: {
          test: {
            subtest: '2'
          }
        }
      }
    },
    groupOps: {}
  };
  it('1# Should correctly generate Publish Operations ', function () {
    [PublishOperations,ScenarioOperations] = GenerateOperations(parsedAsyncApi,parsedScenario);
    expect(PublishOperations).to.deep.equal(expectedPublishOperations);
  });
});