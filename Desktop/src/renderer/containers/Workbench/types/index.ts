import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ScenarioObject {}

export type DefaultWorkBenchStateType = {
  currentValidScenario: ScenarioObject;
  upForVisualization: boolean;
  scenarioUpdated: boolean;
  pendingActions: Array<any>;
};

export type WorkBenchContextType = React.Context<{
  state: DefaultWorkBenchStateType;
  dispatch: React.Dispatch<any>;
}>;

export type WorkBenchPropsType = {
  children: React.ReactNode;
};
