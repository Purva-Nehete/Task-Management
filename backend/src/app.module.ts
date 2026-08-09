import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    TasksModule,
    ProjectsModule,
    SubtasksModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}