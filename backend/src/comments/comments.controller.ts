import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Post('tasks/:taskId/comments')
  create(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(
      taskId,
      createCommentDto,
    );
  }

  @Get('tasks/:taskId/comments')
  findAll(
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.commentsService.findAll(taskId);
  }

  @Get('comments/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commentsService.findOne(id);
  }

  @Patch('comments/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(
      id,
      updateCommentDto,
    );
  }

  @Delete('comments/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commentsService.remove(id);
  }
}