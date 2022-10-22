import React, { useReducer } from 'react';
import { ACTIONS_IDS, defaultEditorState } from '../constants';
// eslint-disable-next-line import/prefer-default-export
const EditorReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS_IDS.visualizeScenarioFile:
      console.log('test');
      console.log(state.pendingActions);
      return {
        ...state,
        pendingActions: [
          ...state.pendingActions,
          { [action.payload.actionName]: action.payload.type },
        ],
      };

    case ACTIONS_IDS.setCurrentScenarioFile:
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
    case ACTIONS_IDS.visualizationChangeStatus:
      return {
        ...state,
        scenarioUpdated: false,
      };
    default:
      return state;
  }
};

const EditorContext = React.createContext(defaultEditorState);

function EditorStateProvider({ children }) {
  const [state, dispatch] = useReducer(EditorReducer, defaultEditorState);
  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export { EditorStateProvider, EditorContext };
