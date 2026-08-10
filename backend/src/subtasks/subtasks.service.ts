import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    taskId: number,
    createSubtaskDto: CreateSubtaskDto,
  ) {
    // Make sure the parent task exists
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

    return this.prisma.subtask.create({
      data: {
        title: createSubtaskDto.title,
        completed: createSubtaskDto.completed ?? false,
        task: {
          connect: {
            id: taskId,
          },
        },
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

    return this.prisma.subtask.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const subtask = await this.prisma.subtask.findUnique({
      where: {
        id,
      },
    });

    if (!subtask) {
      throw new NotFoundException(
        `Subtask ${id} not found`,
      );
    }

    return subtask;
  }

  async update(
    id: number,
    updateSubtaskDto: UpdateSubtaskDto,
  ) {
    await this.findOne(id);

    return this.prisma.subtask.update({
      where: {
        id,
      },
      data: updateSubtaskDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.subtask.delete({
      where: {
        id,
      },
    });
  }
}