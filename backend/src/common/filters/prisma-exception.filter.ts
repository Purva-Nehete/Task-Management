import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception.code === 'P2002') {
      throw new ConflictException('A record with these unique values already exists');
    }

    if (exception.code === 'P2003') {
      throw new BadRequestException('A referenced record does not exist');
    }

    if (exception.code === 'P2025') {
      throw new NotFoundException('The requested record was not found');
    }

    response.status(500).json({
      statusCode: 500,
      message: 'Database operation failed',
    });
  }
}