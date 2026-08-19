import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { stripPasswordHash } from '../common/mappers/public-user.mapper';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, actorId?: number) {
    const leadId = createProjectDto.leadId ?? actorId;

    if (leadId !== undefined) {
      await this.ensureUserExists(leadId);
    }

    return this.prisma.project.create({
      data: { ...createProjectDto, leadId },
    });
  }

  async findAll(actorId?: number) {
    const projects = await this.prisma.project.findMany({
      where: actorId === undefined ? undefined : {
        OR: [
          { leadId: actorId },
          { tasks: { some: { reporterId: actorId } } },
          { tasks: { some: { members: { some: { userId: actorId } } } } },
        ],
      },
      include: {
        lead: true,
        tasks: {
          include: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return stripPasswordHash(projects);
  }

  async findOne(id: number, actorId?: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        lead: true,
        tasks: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    if (actorId !== undefined && !this.canAccess(project, actorId)) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return stripPasswordHash(project);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, actorId?: number) {
    await this.findOne(id, actorId);

    if (updateProjectDto.leadId !== undefined) {
      await this.ensureUserExists(updateProjectDto.leadId);
    }

    const project = await this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });

    return stripPasswordHash(project);
  }

  async remove(id: number, actorId?: number) {
    await this.findOne(id, actorId);

    return this.prisma.project.delete({
      where: { id },
    });
  }

  private canAccess(project: { leadId: number | null; tasks: Array<{ reporterId: number; members: Array<{ userId: number }> }> }, actorId: number) {
    return project.leadId === actorId || project.tasks.some((task) => task.reporterId === actorId || task.members.some((member) => member.userId === actorId));
  }

  private async ensureUserExists(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}