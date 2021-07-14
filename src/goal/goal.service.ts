import { Injectable } from '@nestjs/common';
import { CreateGoalDto, TransferGoalDto, GoalType } from './goal.dto';
import { Goal } from './goal.entity';
import { GoalRepository } from './goal.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenRepository } from '../token/token.repository';
import { plaidClient } from '../appConfigs/plaidConfig';
import { decrypt } from '../appConfigs/encryption.config';
import { Account } from 'plaid';
import { AppModule } from 'src/app.module';
// import { Account } from '../token/token.dto';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(GoalRepository)
    private goalRepository: GoalRepository,
    @InjectRepository(TokenRepository)
    private tokenRepository: TokenRepository,
  ) {}
  async getGoals(userId: string): Promise<Goal[]> {
    return this.goalRepository.getGoalsByUser(userId);
  }

  async createGoal(
    userId: string,
    createGoalDto: CreateGoalDto,
  ): Promise<void> {
    const { name, accountId, goalAmount } = createGoalDto;
    await this.goalRepository.createGoal(userId, accountId, goalAmount, name);
  }

  async deleteGoal(userId: string, goalId: string): Promise<void> {
    const goal = await this.goalRepository.findOne({ id: goalId });
    if (!goal || !(await goal.validateOwner(userId))) {
      throw new Error('Goal not found or owned by user');
    }

    await this.goalRepository.delete(goal.id);
  }

  async transferGoalAmount(userId: string, transferGoalDto: TransferGoalDto) {
    const {
      fromGoalId,
      toGoalId,
      transferAmount,
      toGoalType,
      fromGoalType,
      itemId,
    } = transferGoalDto;

    if (!fromGoalId || !toGoalId) {
      throw new Error('Request reequires both to and from goal IDs');
    }

    if (fromGoalId === toGoalId) {
      throw new Error('Goal IDs can not match');
    }

    let newFromGoalAmount;
    if (fromGoalType === GoalType.ACCOUNT) {
      //check if account exists and has sufficient balance
      const account = await this.getAccount(userId, fromGoalId, itemId);

      const sufficientBalance = await this.sufficientAccountBalance(
        userId,
        account,
        transferAmount,
      );
      if (!sufficientBalance) {
        throw new Error('Insufficient funds');
      }
    } else {
      let fromGoal = await this.goalRepository.findOne({ id: fromGoalId });

      if (!fromGoal || !(await fromGoal.validateOwner(userId))) {
        throw new Error('Goal not found or owned by user');
      }

      if (parseFloat(fromGoal.goalCurrentAmount) < transferAmount) {
        console.log(parseFloat(fromGoal.goalCurrentAmount));
        console.log(transferAmount);
        throw new Error('Insufficient funds');
      }

      newFromGoalAmount =
        parseFloat(fromGoal.goalCurrentAmount) - transferAmount;
    }

    let newToGoalAmount;
    if (toGoalType === GoalType.ACCOUNT) {
      // ensure account exists
      await this.getAccount(userId, toGoalId, itemId);
    } else {
      let toGoal = await this.goalRepository.findOne({ id: toGoalId });

      if (!toGoal || !(await toGoal.validateOwner(userId))) {
        throw new Error('Goal not found or owned by user');
      }

      newToGoalAmount = parseFloat(toGoal.goalCurrentAmount) + transferAmount;
    }

    // if all checks pass then update goal accounts with new totals if any
    if (newFromGoalAmount) {
      await this.goalRepository.update(fromGoalId, {
        goalCurrentAmount: newFromGoalAmount.toString(),
      });
    }

    if (newToGoalAmount) {
      await this.goalRepository.update(toGoalId, {
        goalCurrentAmount: newToGoalAmount.toString(),
      });
    }
  }

  private async getAccount(
    userId: string,
    accountId: string,
    itemId: string,
  ): Promise<Account> {
    const token = await this.tokenRepository.findOne({
      select: ['accessToken', 'itemId'],
      where: { userId: userId, itemId: itemId },
    });

    const decryptedToken = decrypt(token.accessToken);
    const accountResponse = await plaidClient.getAccounts(decryptedToken);
    const account = accountResponse.accounts.find(
      account => account.account_id === accountId,
    );

    if (!account) {
      throw new Error('Account does not exist for item ID');
    }

    return account;
  }

  private async sufficientAccountBalance(
    userId: string,
    account: Account,
    transferAmount: number,
  ): Promise<boolean> {
    let sufficientBalance = false;
    let actualAccountBalance = account.balances.current;
    const goalBalances = await this.goalRepository.find({
      select: ['goalCurrentAmount'],
      where: { userId: userId, accountId: account.account_id },
    });

    const goalBalance = goalBalances.reduce(
      (a, b) => a + parseFloat(b.goalCurrentAmount),
      0.0,
    );

    if (actualAccountBalance <= goalBalance) {
      return sufficientBalance;
    }

    let adjustedAccountBalance = actualAccountBalance - goalBalance;

    if (adjustedAccountBalance >= transferAmount) {
      sufficientBalance = true;
    }

    return sufficientBalance;
  }
}
