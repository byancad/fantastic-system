import { Repository, EntityRepository } from 'typeorm';
import { Goal } from './goal.entity';

@EntityRepository(Goal)
export class GoalRepository extends Repository<Goal> {
  async createGoal(
    userId: string,
    accountId: string,
    goalAmount: number,
    name: string,
  ): Promise<void> {
    const goal = new Goal();
    goal.accountId = accountId;
    goal.goalAmount = goalAmount.toString();
    goal.goalCurrentAmount = (0.0).toString();
    goal.name = name;
    goal.userId = userId;
    await goal.save();
  }

  async getGoalsByUser(userId: string): Promise<Goal[]> {
    const query = this.createQueryBuilder('goal');
    query.select([
      'goal.id',
      'goal.accountId',
      'goal.name',
      'goal.goalAmount',
      'goal.goalCurrentAmount',
    ]);
    query.andWhere('user_id = :userId', { userId });
    return await query.getMany();
  }
}
