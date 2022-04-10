import { ACTIONS_IDS } from '../constants';
// eslint-disable-next-line import/prefer-default-export
export const WorkBenchReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS_IDS.simulateAction:
      console.log('test');
      console.log(state.pendingActions);
      return {
        ...state,
        pendingActions: [
          ...state.pendingActions,
          { [action.payload.actionName]: action.payload.type },
        ],
      };
    case ACTIONS_IDS.visualizeScenarioFile:
      console.log('visualizeScenarioFile');
      return { ...state, upForVisualization: true };

    case ACTIONS_IDS.setScenarioFile:
      console.log('setScenarioFile');
      console.log(action);
      return {
        ...state,
        currentValidScenario: action.payload,
        scenarioUpdated: true,
      };
    case ACTIONS_IDS.executeOperartion:
      return {
        ...state,

        scenarioFilepath: action.payload.operation,
      };
    case ACTIONS_IDS.visualizationGenerating:
      return {
        ...state,
        scenarioUpdated: false,
      };
    default:
      return state;
  }
};
