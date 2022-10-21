// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { createContext, useEffect, useReducer } from 'react';
import { EditorPropsType, DefaultEditorStateType } from './types';
import { editorReducer } from './reducers';
import { defaultEditorState } from './constants';
import { TitleBar } from '../TitleBar';
import template from '../TitleBar/menuTemplate';
import ScenarioWorkbench from '../Workbench';
import icon from '../../../../assets/icon.svg';

const EditorContext = createContext<{
  state: DefaultEditorStateType;
  dispatch: React.Dispatch<any>;
}>({
  state: defaultEditorState,
  dispatch: () => null,
});
function Editor(props: EditorPropsType): JSX.Element {
  const [state, dispatch] = useReducer(editorReducer, defaultEditorState);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      <TitleBar icon={icon} menu={template} />
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
        className="MainContentArea"
      >
        <ScenarioWorkbench />
      </div>
    </EditorContext.Provider>
  );
}

export { EditorContext, Editor };
