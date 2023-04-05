import React, { useCallback, useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import { ipcRenderer } from 'electron';
import { ACTIONS_IDS } from '../../Editor/constants';

// Example style, you can use another
function ScenarioEditor({ EditorState, dispatch }): JSX.Element {
  const [EditorContent, setContent] = useState('myScenario:');

  const getContent = useCallback(() => {
    return EditorContent;
  }, [EditorContent]);

  const setUpForVisualization = useCallback(
    (value) => {
      EditorState.visualizationRequested = value;
    },
    [EditorState]
  );

  useEffect(() => {
    function getCurrentScenario() {
      return getContent();
    }
    function updateVisualizationObj(_event: any, obj: any) {
      dispatch({
        type: ACTIONS_IDS.setCurrentVisualization,
        payload: obj,
      });
    }
    console.log('effectara');
    if (EditorState.visualizationRequested === true) {
      ipcRenderer.on('editor/visualizationReady', updateVisualizationObj);
      ipcRenderer.send('editor/visualizeRequest', getCurrentScenario());
      setUpForVisualization(false);
    }

    // TODO add case for save scenario action

    return function onUnmount() {
      ipcRenderer.removeListener(
        'editor/visualizationReady',
        updateVisualizationObj
      );
    };
  }, [
    setUpForVisualization,
    getContent,
    EditorState.visualizationRequested,
    EditorState,
    dispatch,
  ]);
  return (
    <div
      style={{
        height: '100%',
        left: '48px',
        width: '50%',
        overflow: 'hidden',
      }}
    >
      <>
        <AceEditor
          mode="java"
          theme="github"
          onChange={(code) => setContent(code)}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
      </>
    </div>
  );
}

export default ScenarioEditor;
