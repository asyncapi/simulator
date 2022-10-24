// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { VscRunAll } from 'react-icons/vsc';
import { IconContext } from 'react-icons';
import { ACTIONS_IDS } from '../constants';
// eslint-disable-next-line import/no-cycle
import { WorkBenchContext } from '..';
import { ipcRenderer } from 'electron';

function SideBar({ EditorState, dispatch }): JSX.Element {
  async function VisualizeScenario() {
    console.log(dispatch);
  }

  const [RunIconStyle, SetRunStyle] = useState({
    color: 'white',
  });
  function onEnterButton() {
    SetRunStyle({ ...RunIconStyle, color: 'yellow' });
  }

  function onExitButton() {
    SetRunStyle({ ...RunIconStyle, color: 'white' });
  }

  return (
    <>
      <div
        style={{
          left: 0,
          width: 48,
          height: '100%',
          backgroundColor: '#1F2937',
          border: '1px solid #374151',
        }}
        className="Sidebar"
      >
        <IconContext.Provider
          value={{ className: 'global-class-name', size: '30' }}
        >
          <div style={{ marginBottom: 'auto', padding: '6px 6px' }}>
            <button
              onPointerEnter={onEnterButton}
              onPointerLeave={onExitButton}
              onClick={VisualizeScenario}
              style={{
                backgroundColor: 'transparent',
                backgroundRepeat: 'no-repeat',
                border: 'none',
                cursor: 'pointer',
                overflow: 'hidden',
                width: 'inherit',
                padding: 0,
              }}
              type="button"
            >
              <VscRunAll style={RunIconStyle} />
            </button>
          </div>
        </IconContext.Provider>
      </div>
    </>
  );
}

export default SideBar;
