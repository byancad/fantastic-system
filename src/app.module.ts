import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './appConfigs/typeOrm.config';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TokenModule } from './token/token.module';
import { GoalModule } from './goal/goal.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    RolesModule,
    TokenModule,
    GoalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
