import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { stripPasswordHash } from '../common/mappers/public-user.mapper';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, actorId?: number) {
    const {
      memberIds,
      dueDate,
      projectId,
      reporterId,
      ...taskData
    } = createTaskDto;

    const effectiveReporterId = actorId ?? reporterId;
    await this.ensureReferences(projectId, effectiveReporterId, memberIds);

    const task = await this.prisma.task.create({
      data: {
        ...taskData,
        projectId,
        reporterId: effectiveReporterId,
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

  async findAll(query: QueryTaskDto, actorId?: number) {
    const {
      status,
      priority,
      projectId,
      reporterId,
      search,
    } = query;

    const tasks = await this.prisma.task.findMany({
      where: {
        status,
        priority,
        projectId,
        reporterId,

        ...(actorId === undefined ? {} : {
          OR: [
            { reporterId: actorId },
            { project: { leadId: actorId } },
            { members: { some: { userId: actorId } } },
          ],
        }),

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

    return stripPasswordHash(tasks);
  }

  async findOne(id: number, actorId?: number) {
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

    if (actorId !== undefined && !this.canAccess(task, actorId)) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return stripPasswordHash(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, actorId?: number) {
    const existingTask = await this.findOne(id, actorId);

    const {
      memberIds,
      dueDate,
      projectId,
      reporterId,
      ...taskData
    } = updateTaskDto;

    await this.ensureReferences(
      projectId ?? existingTask.projectId,
      actorId ?? reporterId ?? existingTask.reporterId,
      memberIds,
    );

    return this.prisma.$transaction(async (transaction) => {
      return transaction.task.update({
      where: { id },

      data: {
        ...taskData,

        dueDate: dueDate
          ? new Date(dueDate)
          : undefined,

        members:
          memberIds !== undefined
            ? {
                deleteMany: {},
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
    });
  }

  async remove(id: number, actorId?: number) {
    await this.findOne(id, actorId);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  private canAccess(task: { reporterId: number; project: { leadId: number | null }; members: Array<{ userId: number }> }, actorId: number) {
    return task.reporterId === actorId || task.project.leadId === actorId || task.members.some((member) => member.userId === actorId);
  }

  async ensureReferences(projectId: number, reporterId: number, memberIds?: number[]) {
    const [project, reporter] = await Promise.all([
      this.prisma.project.findUnique({ where: { id: projectId } }),
      this.prisma.user.findUnique({ where: { id: reporterId } }),
    ]);

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    if (!reporter) {
      throw new NotFoundException(`User ${reporterId} not found`);
    }

    if (memberIds && new Set(memberIds).size !== memberIds.length) {
      throw new BadRequestException('memberIds must not contain duplicates');
    }

    if (memberIds?.length) {
      const members = await this.prisma.user.count({ where: { id: { in: memberIds } } });

      if (members !== memberIds.length) {
        throw new NotFoundException('One or more task members were not found');
      }
    }
  }
}