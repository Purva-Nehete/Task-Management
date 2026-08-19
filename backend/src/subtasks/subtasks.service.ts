import {
  ForbiddenException,
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
    userId?: number,
  ) {
    // Make sure the parent task exists
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

    return this.prisma.subtask.create({
      data: {
        title: createSubtaskDto.title,
        completed: createSubtaskDto.completed ??
          (createSubtaskDto.status === 'COMPLETED'),
        task: {
          connect: {
            id: taskId,
          },
        },
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

    return this.prisma.subtask.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: number, userId?: number) {
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

    if (userId !== undefined) {
      const task = await this.prisma.task.findUnique({
        where: { id: subtask.taskId },
        include: { project: true, members: true },
      });

      if (!task) {
        throw new NotFoundException(`Task ${subtask.taskId} not found`);
      }

      this.assertTaskAccess(task, userId);
    }

    return subtask;
  }

  async update(
    id: number,
    updateSubtaskDto: UpdateSubtaskDto,
    userId?: number,
  ) {
    await this.findOne(id, userId);

    const completed =
      updateSubtaskDto.completed ??
      (updateSubtaskDto.status === 'COMPLETED'
        ? true
        : updateSubtaskDto.status === 'TODO'
          ? false
          : undefined);

    return this.prisma.subtask.update({
      where: {
        id,
      },
      data: {
        title: updateSubtaskDto.title,
        completed,
      },
    });
  }

  async remove(id: number, userId?: number) {
    await this.findOne(id, userId);

    return this.prisma.subtask.delete({
      where: {
        id,
      },
    });
  }

  private assertTaskAccess(task: { reporterId: number; project: { leadId: number | null }; members: Array<{ userId: number }> }, userId: number) {
    if (task.reporterId !== userId && task.project.leadId !== userId && !task.members.some((member) => member.userId === userId)) {
      throw new ForbiddenException('You do not have access to this task');
    }
  }
}