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
  ) {
    return this.subtasksService.create(
      taskId,
      createSubtaskDto,
    );
  }

  @Get('tasks/:taskId/subtasks')
  findAll(
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.subtasksService.findAll(taskId);
  }

  @Get('subtasks/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subtasksService.findOne(id);
  }

  @Patch('subtasks/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.subtasksService.update(
      id,
      updateSubtaskDto,
    );
  }

  @Delete('subtasks/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subtasksService.remove(id);
  }
}