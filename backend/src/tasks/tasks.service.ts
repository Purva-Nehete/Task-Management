import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const {
      memberIds,
      dueDate,
      ...taskData
    } = createTaskDto;

    const task = await this.prisma.task.create({
      data: {
        ...taskData,
        dueDate: dueDate ? new Date(dueDate) : undefined,

        members: memberIds
          ? {
              create: memberIds.map((userId) => ({
                user: {
                  connect: {
                    id: userId,
                  },
                },
              })),
            }
          : undefined,
      },

      include: {
        project: true,
        reporter: true,
        members: {
          include: {
            user: true,
          },
        },
        subtasks: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    return task;
  }

  async findAll(query: QueryTaskDto) {
    const {
      status,
      priority,
      projectId,
      reporterId,
      search,
    } = query;

    return this.prisma.task.findMany({
      where: {
        status,
        priority,
        projectId,
        reporterId,

        ...(search
          ? {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },

      include: {
        project: true,
        reporter: true,
        members: {
          include: {
            user: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },

      include: {
        project: true,
        reporter: true,

        members: {
          include: {
            user: true,
          },
        },

        subtasks: true,

        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);

    const {
      memberIds,
      dueDate,
      ...taskData
    } = updateTaskDto;

    if (memberIds !== undefined) {
      await this.prisma.taskMember.deleteMany({
        where: {
          taskId: id,
        },
      });
    }

    return this.prisma.task.update({
      where: { id },

      data: {
        ...taskData,

        dueDate: dueDate
          ? new Date(dueDate)
          : undefined,

        members:
          memberIds !== undefined
            ? {
                create: memberIds.map((userId) => ({
                  user: {
                    connect: {
                      id: userId,
                    },
                  },
                })),
              }
            : undefined,
      },

      include: {
        project: true,
        reporter: true,
        members: {
          include: {
            user: true,
          },
        },
        subtasks: true,
        comments: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}