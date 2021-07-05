export type CreateGoalDto = {
  accountId: string;
  name: string;
  goalAmount: number;
};

export type TransferGoalDto = {
  fromGoalId: string;
  toGoalId: string;
  transferAmount: number;
};
