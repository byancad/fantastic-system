import { User } from './users.entity';

export class AuthenticateUserDto {
  email: string;
  password: string;
}

export class UserDetailsDto {
  user: User;
}
