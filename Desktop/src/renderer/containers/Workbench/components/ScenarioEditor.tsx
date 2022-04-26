import React, { useCallback, useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import { ipcRenderer } from 'electron';
import { WorkBenchContext } from '..';
import { DefaultWorkBenchStateType } from '../types';
import { ACTIONS_IDS } from '../constants';

// Example style, you can use another
function ScenarioEditor(): JSX.Element {
  const WBContext: {
    state: DefaultWorkBenchStateType;
    dispatch: (arg0: Record<string, unknown>) => null;
  } = useContext(WorkBenchContext);

  const [EditorContent, setContent] = useState('myScenario:');

  const getContent = useCallback(() => {
    return EditorContent;
  }, [EditorContent]);

  const setUpForVisualization = useCallback(
    (value) => {
      WBContext.state.upForVisualization = value;
    },
    [WBContext.state]
  );

  useEffect(() => {
    function getCurrentScenario() {
      return getContent();
    }
    function updateVisualizationObj(_event: any, obj: any) {
      WBContext.dispatch({ type: ACTIONS_IDS.setScenarioFile, payload: obj });
    }
    console.log('effectara');
    if (WBContext.state.upForVisualization === true) {
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
    WBContext.state.upForVisualization,
    WBContext,
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
      <WorkBenchContext.Consumer>
        {() => (
          <AceEditor
            mode="java"
            theme="github"
            onChange={(code) => setContent(code)}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
          />
        )}
      </WorkBenchContext.Consumer>
    </div>
  );
}

export default ScenarioEditor;
