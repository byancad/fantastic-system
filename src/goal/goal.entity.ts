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

  @Column()
  goalAmount: number;

  @Column()
  goalcurrentAmount: number;

  async validateOwner(userId: string): Promise<boolean> {
    return userId === this.userId;
  }
}
