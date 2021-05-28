import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticateUserDto, UserDetailsDto } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async userSignUp(authenticateUserDto: AuthenticateUserDto): Promise<void> {
    const { email, password } = authenticateUserDto;
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await this.hashPassword(password, salt);

    await this.usersRepository.createUser(email, encryptedPassword, salt);
  }

  async userSignIn(authenticateUserDto: AuthenticateUserDto): Promise<string> {
    const { email, password } = authenticateUserDto;

    const user = await this.usersRepository.findOne({ email });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid User Credentials');
    }

    const payload: JwtPayload = { id: user.id };

    const jwt = await this.jwtService.sign(payload);

    return jwt;
  }

  async getUserDetails(id: string): Promise<UserDetailsDto> {
    const user = await this.usersRepository.findOne(id, {
      select: ['id', 'employerId', 'email'],
      relations: ['roles'],
    });

    const userDetails = new UserDetailsDto();
    userDetails.user = user;

    return userDetails;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
