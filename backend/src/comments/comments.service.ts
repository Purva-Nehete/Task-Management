import {
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
  ) {
    // Check that task exists
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException(
        `Task ${taskId} not found`,
      );
    }

    // Check that user exists
    const user = await this.prisma.user.findUnique({
      where: {
        id: createCommentDto.userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User ${createCommentDto.userId} not found`,
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
            id: createCommentDto.userId,
          },
        },
      },

      include: {
        user: true,
      },
    });
  }

  async findAll(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException(
        `Task ${taskId} not found`,
      );
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

  async findOne(id: number) {
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

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    await this.findOne(id);

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

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }
}