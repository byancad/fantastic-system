import { Module } from '@nestjs/common';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalRepository } from './goal.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GoalRepository])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
