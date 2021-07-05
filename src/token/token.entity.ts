import { BaseEntity, Entity, Column, Unique, PrimaryColumn } from 'typeorm';

@Entity()
@Unique(['accessToken'])
export class Token extends BaseEntity {
  @PrimaryColumn({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'item_id' })
  itemId: string;

  @Column({ name: 'user_id' })
  userId: string;
}
