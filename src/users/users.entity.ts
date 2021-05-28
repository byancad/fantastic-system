import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique , ManyToMany, JoinTable} from 'typeorm';
import { Roles } from '../roles/roles.entity';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employerId: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @ManyToMany(type => Roles, roles => roles.users, {cascade: true})
  @JoinTable({
    name: 'users_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id'},
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id'},
  })
  
  roles: Roles[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
