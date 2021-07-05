import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoalService } from './goal.service';
import { CreateGoalDto, TransferGoalDto } from './goal.dto';

@Controller('goal')
@UseGuards(AuthGuard())
export class GoalController {
  constructor(private goalService: GoalService) {}
  @Get()
  @HttpCode(200)
  getGoals(@Req() req): Promise<any> {
    return this.goalService.getGoals(req.user.id);
  }

  @Post()
  @HttpCode(200)
  createGoal(@Req() req, @Body() createGoalDto: CreateGoalDto): Promise<any> {
    return this.goalService.createGoal(req.user.id, createGoalDto);
  }

  @Delete('/:goalId')
  @HttpCode(200)
  deleteGoal(@Req() req, @Param() goalId): Promise<any> {
    return this.goalService.deleteGoal(req.user.id, goalId);
  }

  @Post()
  @HttpCode(200)
  transferBetweenAccounts(
    @Req() req,
    @Body() transferGoalDto: TransferGoalDto,
  ): Promise<any> {
    return this.goalService.transferGoalAmount(req.user.id, transferGoalDto);
  }
}
