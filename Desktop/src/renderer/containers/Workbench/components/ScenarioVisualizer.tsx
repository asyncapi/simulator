// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
// eslint-disable-next-line import/no-cycle,import/no-duplicates
// eslint-disable-next-line import/no-cycle
import { WorkBenchContext } from '..';
import { ACTIONS_IDS } from '../constants';

function ScenarioVisualizer(props: any): JSX.Element {
  const WBContext = useContext(WorkBenchContext);

  const [actionsRegister, updateRegister] = useState({
    pendingAction: null,
    doneActions: {},
  });

  // eslint-disable-next-line react/prop-types
  function GenerateScenariosView({ scenarioObject }) {
    console.log('GenerateScenariosView');
    console.log(scenarioObject);

    // eslint-disable-next-line react/prop-types
    if (!scenarioObject.scenarios) {
      return <div />;
    }
    return (
      <>
        <h2>Scenarios</h2>
        {/* eslint-disable-next-line react/prop-types */}
        {Object.keys(scenarioObject.scenarios).map((scenarioName) => {
          const name = scenarioName.match(new RegExp(/[^-]*$/, 'gm')); //NOSONAR
          return (
            <div key={scenarioName}>
              <div
                style={{
                  fontFamily:
                    'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
                  fontSize: '1rem',
                  lineHeight: '1.5rem',
                }}
              >
                {name[0]}
                <div>
                  {/* eslint-disable-next-line react/button-has-type */}
                  <button
                    onClick={() => {
                      WBContext.dispatch({
                        type: ACTIONS_IDS.simulateAction,
                        payload: {
                          actionName: scenarioName,
                          type: ACTIONS_IDS.simpleInvocation,
                        },
                      });
                      updateRegister({
                        ...actionsRegister,
                        pendingAction: scenarioName,
                      });
                    }}
                  >
                    Simulate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  // eslint-disable-next-line react/prop-types
  function GenerateOperationsView({ operationsObj }) {
    console.log(operationsObj);
    return <p>Test</p>;
  }

  const [currentScenario, setScenario] = useState({});

  // eslint-disable-next-line @typescript-eslint/no-redeclare
  function setLocalState(scenario) {
    console.log(scenario);
    setScenario(scenario);
  }

  useEffect(() => {
    console.log('visualizer');

    if (actionsRegister.pendingAction) {
      ipcRenderer.send('editor/action', actionsRegister.pendingAction);
    }
    if (WBContext.state.scenarioUpdated === true) {
      console.log('GENERATING');
      setLocalState(WBContext.state.currentValidScenario);
      WBContext.dispatch({
        type: ACTIONS_IDS.visualizationGenerating,
      });

      // WBContext.dispatch({ type: ACTIONS_IDS.visualizationGenerating });
    }

    // TODO add case for save scenario action

    return function onUnmount() {
      // WBContext.dispatch({ type: ACTIONS_IDS.visualizationGenerating });
    };
  }, [WBContext, WBContext.state, actionsRegister]);

  return (
    <div
      style={{
        width: '50%',
        height: '100%',
        padding: 5,
        margin: '0px',
        marginLeft: 7,
        marginTop: 1,
        backgroundColor: 'azure',
      }}
    >
      <GenerateScenariosView scenarioObject={currentScenario} />
    </div>
  );
}

export default ScenarioVisualizer;
