import { Module } from '@nestjs/common';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalRepository } from './goal.repository';
import { PassportModule } from '@nestjs/passport';
import { TokenRepository } from 'src/token/token.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([GoalRepository, TokenRepository]),
  ],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
