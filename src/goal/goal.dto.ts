export type CreateGoalDto = {
  accountId: string;
  name: string;
  goalAmount: number;
};

export enum GoalType {
  ACCOUNT = 'ACCOUNT',
  GOAL = 'GOAL',
}

export type TransferGoalDto = {
  fromGoalId: string;
  fromGoalType: GoalType;
  toGoalId: string;
  toGoalType: GoalType;
  transferAmount: number;
  itemId?: string;
};
