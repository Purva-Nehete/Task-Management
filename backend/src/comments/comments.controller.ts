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

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Post('tasks/:taskId/comments')
  create(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.create(
      taskId,
      createCommentDto,
      user.id,
    );
  }

  @Get('tasks/:taskId/comments')
  findAll(
    @Param('taskId', ParseIntPipe) taskId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.findAll(taskId, user.id);
  }

  @Get('comments/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.findOne(id, user.id);
  }

  @Patch('comments/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.update(id, updateCommentDto, user.id);
  }

  @Delete('comments/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.remove(id, user.id);
  }
}