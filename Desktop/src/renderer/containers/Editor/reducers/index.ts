import { ACTIONS_IDS } from '../constants';
// eslint-disable-next-line import/prefer-default-export
export const editorReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS_IDS.set_fp_AsyncApi:
      return [...state, { asyncApiFilepath: action.payload.filepath }];
    case ACTIONS_IDS.set_fp_Scenario:
      return [
        ...state,
        {
          scenarioFilepath: action.payload.filepath,
        },
      ];
    default:
      return state;
  }
};
