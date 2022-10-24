import * as types from '../types';

export const ACTIONS_IDS = {
  checkScenarioSyntax: 0,
  visualizeScenarioFile: 1,
  executeOperation: 2,
  executeScenario: 3,
  cancelExecution: 4,
  setCurrentScenarioFile: 5,
  scenarioUpdated: 6,
};

export const defaultEditorState: types.DefaultWorkBenchStateType = {
  currentScenario: {},
  scenarioUpdated: false,
  pendingRequestExecutions: {},
  applicationActionsHistory: [],
};

export const defaultScenario = `version: "0.0.1"
user-logs-on:
  game/server/{serverId}/events/player/{playerId}/connect:
    playerId :
      min: 0
      max: 2000
    serverId:
      min: 0
      max: 4
user-gameLoop:
  loop:
    interval:
      600
    cycles:
      5
    game/server/{serverId}/events/player/{playerId}/hit:
      serverId: '1'
      playerId:
        regex: '^[\\w\\d]{1,22}$'

    game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup:
      serverId: '1'
      playerId:
        regex: '^[\\w\\d]{1,22}$'
      itemId:
        min: 0
        max: 4

    game/server/{serverId}/events/player/{playerId}/chat:
      serverId: '1'
      playerId:
        regex: '^[\\w\\d]{1,22}$'
      payload: 'well played m8'

scenario-SimpleGame:
 - user-logs-on
 - user-gameLoop`;
