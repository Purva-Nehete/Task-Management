import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { toPublicUser } from '../common/mappers/public-user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: createUserDto.email,
          },
          {
            username: createUserDto.username,
          },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'A user with this email or username already exists',
      );
    }

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return toPublicUser(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(toPublicUser);
  }

  async findOne(id: number, actorId?: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (actorId !== undefined && actorId !== id) {
      throw new ForbiddenException('You can only access your own user profile');
    }

    return toPublicUser(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto, actorId?: number) {
    await this.findOne(id, actorId);

    if (updateUserDto.email || updateUserDto.username) {
      const duplicateConditions: Prisma.UserWhereInput[] = [];

      if (updateUserDto.email) {
        duplicateConditions.push({
          email: updateUserDto.email,
        });
      }

      if (updateUserDto.username) {
        duplicateConditions.push({
          username: updateUserDto.username,
        });
      }

      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: duplicateConditions,
          NOT: {
            id,
          },
        },
      });

      if (existingUser) {
        throw new ConflictException(
          'A user with this email or username already exists',
        );
      }
    }

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return toPublicUser(user);
  }

  async remove(id: number, actorId?: number) {
    await this.findOne(id, actorId);

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}