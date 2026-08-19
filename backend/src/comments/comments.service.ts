import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    taskId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ) {
    // Check that task exists
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: { project: true, members: true },
    });

    if (!task) {
      throw new NotFoundException(
        `Task ${taskId} not found`,
      );
    }

    this.assertTaskAccess(task, userId);

    // Check that user exists
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User ${userId} not found`,
      );
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,

        task: {
          connect: {
            id: taskId,
          },
        },

        user: {
          connect: {
            id: userId,
          },
        },
      },

      include: {
        user: true,
      },
    });
  }

  async findAll(taskId: number, userId?: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: { project: true, members: true },
    });

    if (!task) {
      throw new NotFoundException(
        `Task ${taskId} not found`,
      );
    }

    if (userId !== undefined) {
      this.assertTaskAccess(task, userId);
    }

    return this.prisma.comment.findMany({
      where: {
        taskId,
      },

      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },

      include: {
        user: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(
        `Comment ${id} not found`,
      );
    }

    if (userId !== undefined) {
      const task = await this.prisma.task.findUnique({
        where: { id: comment.taskId },
        include: { project: true, members: true },
      });

      if (!task) {
        throw new NotFoundException(`Task ${comment.taskId} not found`);
      }

      this.assertTaskAccess(task, userId);
    }

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    userId?: number,
  ) {
    const comment = await this.findOne(id, userId);

    if (userId !== undefined && comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: {
        id,
      },

      data: updateCommentDto,

      include: {
        user: true,
      },
    });
  }

  async remove(id: number, userId?: number) {
    const comment = await this.findOne(id, userId);

    if (userId !== undefined && comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }

  private assertTaskAccess(task: { reporterId: number; project: { leadId: number | null }; members: Array<{ userId: number }> }, userId: number) {
    if (task.project.leadId !== userId && !task.members.some((member) => member.userId === userId)) {
      throw new ForbiddenException('You do not have access to this task');
    }
  }
}