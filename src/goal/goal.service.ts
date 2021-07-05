import { Injectable } from '@nestjs/common';
import { CreateGoalDto, TransferGoalDto } from './goal.dto';
import { Goal } from './goal.entity';
import { GoalRepository } from './goal.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'eslint/lib/rules/*';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(GoalRepository)
    private goalRepository: GoalRepository,
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
    const { fromGoalId, toGoalId, transferAmount } = transferGoalDto;
    if (!fromGoalId || !toGoalId) {
      throw new Error('Request reequires both to and from goal IDs');
    }

    if (fromGoalId === toGoalId) {
      throw new Error('Goal IDs can not match');
    }
    const fromGoal = await this.goalRepository.findOne({ id: fromGoalId });
    const toGoal = await this.goalRepository.findOne({ id: toGoalId });

    if (!fromGoal || !(await fromGoal.validateOwner(userId))) {
      throw new Error('Goal not found or owned by user');
    }

    if (!toGoal || !(await toGoal.validateOwner(userId))) {
      throw new Error('Goal not found or owned by user');
    }

    if (fromGoal.goalcurrentAmount < transferAmount) {
      throw new Error('Insufficient funds');
    }

    const newFromGoalAmount = fromGoal.goalcurrentAmount - transferAmount;
    const newToGoalAmount = toGoal.goalcurrentAmount + transferAmount;

    // save to db
    await this.goalRepository.update(fromGoalId, {
      goalcurrentAmount: newFromGoalAmount,
    });
    await this.goalRepository.update(toGoalId, {
      goalcurrentAmount: newToGoalAmount,
    });
  }
}
