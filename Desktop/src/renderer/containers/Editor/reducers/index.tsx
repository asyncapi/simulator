import React, { useReducer } from 'react';
import { ACTIONS_IDS, defaultEditorState } from '../constants';
// eslint-disable-next-line import/prefer-default-export
const EditorReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS_IDS.checkScenarioSyntax:
      return { ...state };
    case ACTIONS_IDS.scenarioUpdated:
      return { ...state, scenarioUpdated: true };
    case ACTIONS_IDS.setCurrentVisualization:
      return { ...state, visualization: action.payload };
    case ACTIONS_IDS.executeScenario:
      return { ...state };
    case ACTIONS_IDS.executeOperation:
      return { ...state };
    case ACTIONS_IDS.cancelExecution:
      return { ...state };
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

export { EditorReducer, EditorStateProvider, EditorContext };
