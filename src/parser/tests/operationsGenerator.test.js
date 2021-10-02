const {generateOperationsAndScenarios} = require('../GenerateOperationsAndScenarios');
const expect = require('chai').expect;
const {parseFiles} = require('../parseFiles');
const path = require('path');
describe('Operations Generator Tests',  function() {
  let operations,scenarios;
  let parsedAsyncApi,parsedScenario;
  before(async function() {
    [parsedAsyncApi, parsedScenario] = await parseFiles(path.resolve(__dirname,'./files/correct/CorrectlyFormattedAsyncApi.yaml'), path.resolve(__dirname,'./files/correct/CorrectlyFormattedScenario.yaml'));
  });
  const expectedOperations = {
    version: '0.0.1',
    'user-logs-on': {
      'game/server/{serverId}/events/player/{playerId}/connect': {
        playerId: {
          min: 0,
          max: 2000
        },
        serverId: {
          min: 0,
          max: 4
        }
      }
    },
    'user-gameLoop': {
      loop: {
        interval: 600,
        cycles: 5,
        'game/server/{serverId}/events/player/{playerId}/hit': {
          serverId: '1',
          playerId: {
            regex: '^[\\w\\d]{1,22}$'
          },
          payload: {
            crit: 125,
            apDamage: 30
          }
        },
        'game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup': {
          serverId: '1',
          playerId: {
            regex: '^[\\w\\d]{1,22}$'
          },
          itemId: {
            min: 0,
            max: 4
          }
        },
        'game/server/{serverId}/events/player/{playerId}/chat': {
          serverId: '1',
          playerId: {
            regex: '^[\\w\\d]{1,22}$'
          },
          payload: 'well played m8'
        }
      }
    }
  };
  const expectedScenarios = {
    'scenario-SimpleGame': {
      'user-logs-on': {
        'game/server/{serverId}/events/player/{playerId}/connect': {
          playerId: {
            min: 0,
            max: 2000
          },
          serverId: {
            min: 0,
            max: 4
          }
        }
      },
      'user-gameLoop': {
        loop: {
          interval: 600,
          cycles: 5,
          'game/server/{serverId}/events/player/{playerId}/hit': {
            serverId: '1',
            playerId: {
              regex: '^[\\w\\d]{1,22}$'
            },
            payload: {
              crit: 125,
              apDamage: 30
            }
          },
          'game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup': {
            serverId: '1',
            playerId: {
              regex: '^[\\w\\d]{1,22}$'
            },
            itemId: {
              min: 0,
              max: 4
            }
          },
          'game/server/{serverId}/events/player/{playerId}/chat': {
            serverId: '1',
            playerId: {
              regex: '^[\\w\\d]{1,22}$'
            },
            payload: 'well played m8'
          }
        }
      }
    }
  };
  it('Should correctly generate publish operations', function () {
    [operations,scenarios] = generateOperationsAndScenarios(parsedAsyncApi,parsedScenario);
    expect(operations).to.deep.equal(expectedOperations);
  });
  it('Should correctly generate subscribe operations', function () {
    [operations,scenarios] = generateOperationsAndScenarios(parsedAsyncApi,parsedScenario);
    expect(scenarios).to.deep.equal(expectedScenarios);
  });
});
