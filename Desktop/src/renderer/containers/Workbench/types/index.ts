import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ScenarioObject {}

interface RequestCollection {
  [id: string]:
    | 'resolved'
    | 'pendingInfo'
    | { status: 'error'; description: string }
    | {
        status: 'inProgress';
        currentRequestIndex: number;
        finalRequestIndex: number;
      };
}

interface ApplicationAction {
  type: 'newScenario' | 'undo' | 'redo';
}

export type DefaultWorkBenchStateType = {
  currentScenario: ScenarioObject;
  scenarioUpdated: boolean;
  pendingRequestExecutions: RequestCollection;
  applicationActionsHistory: Array<ApplicationAction>;
};

export type WorkBenchContextType = React.Context<{
  state: DefaultWorkBenchStateType;
  dispatch: React.Dispatch<any>;
}>;

export type WorkBenchPropsType = {
  children: React.ReactNode;
};
