// @ts-ignore
import * as types from '../types';

export const ACTIONS_IDS = {
  set_fp_AsyncApi: 0,
  set_fp_Scenario: 1,
  check_fp_AsynApi_Validity: 2,
  check_fp_Scenario_Validity: 3,
  check_format_AsyncApi_Validity: 4,
  check_format_Scenario_Validity: 5,
};

export const defaultEditorState: types.DefaultEditorStateType = {
  asyncApiFilepath: './API.yaml',
  scenarioFilepath: './scenario.yaml',
};
