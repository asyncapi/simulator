import React from 'react';

export type DefaultEditorStateType = {
  asyncApiFilepath: string;
  scenarioFilepath: string;
};

export type EditorContextType = {
  state: DefaultEditorStateType;
  dispatch: React.Dispatch<any>;
};

export type EditorPropsType = {
  children: React.ReactNode;
};
