import * as types from '../types';

export const ACTIONS_IDS = {
  checkScenarioFile: 0,
  visualizeScenarioFile: 1,
  executeOperartion: 2,
  executeScenario: 3,
  setScenarioFile: 4,
  visualizationGenerating: 5,
  visualizationGenerated: 6,
  simulateAction: 7,
  simpleInvocation: 8,
};

export const defaultEditorState: types.DefaultWorkBenchStateType = {
  currentValidScenario: {},
  upForVisualization: false,
  scenarioUpdated: false,
  pendingActions: [],
};
