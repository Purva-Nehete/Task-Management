import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';

import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class SubtasksController {
  constructor(
    private readonly subtasksService: SubtasksService,
  ) {}

  @Post('tasks/:taskId/subtasks')
  create(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() createSubtaskDto: CreateSubtaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.subtasksService.create(taskId, createSubtaskDto, user.id);
  }

  @Get('tasks/:taskId/subtasks')
  findAll(
    @Param('taskId', ParseIntPipe) taskId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.subtasksService.findAll(taskId, user.id);
  }

  @Get('subtasks/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.subtasksService.findOne(id, user.id);
  }

  @Patch('subtasks/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.subtasksService.update(id, updateSubtaskDto, user.id);
  }

  @Delete('subtasks/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.subtasksService.remove(id, user.id);
  }
}