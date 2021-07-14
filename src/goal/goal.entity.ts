import {
  BaseEntity,
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  name: string;

  @Column({ name: 'goal_amount', type: 'numeric' })
  goalAmount: string;

  @Column({ name: 'goal_current_amount', type: 'numeric' })
  goalCurrentAmount: string;

  async validateOwner(userId: string): Promise<boolean> {
    return userId === this.userId;
  }
}
