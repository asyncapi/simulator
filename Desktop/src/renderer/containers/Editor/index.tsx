// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useReducer } from 'react';
import { EditorPropsType } from './types';
import { EditorReducer, EditorContext } from './reducers';
import { defaultEditorState } from './constants';
import { TitleBar } from '../TitleBar';
import template from '../TitleBar/menuTemplate';
import ScenarioWorkbench from '../Workbench';
import icon from '../../../../assets/icon.svg';

function Editor(props: EditorPropsType): JSX.Element {
  const [EditorState, dispatch] = useReducer(EditorReducer, defaultEditorState);

  return (
    <EditorContext.Provider value={{ state: EditorState, dispatch }}>
      <EditorContext.Consumer>
        {({ state, dispatch }) => (
          <>
            <TitleBar
              EditorState={state}
              dispatch={dispatch}
              icon={icon}
              menu={template}
            />
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
              }}
              className="MainContentArea"
            >
              <ScenarioWorkbench EditorState={state} dispatch={dispatch} />
            </div>
          </>
        )}
      </EditorContext.Consumer>
    </EditorContext.Provider>
  );
}

export { EditorContext, Editor };
