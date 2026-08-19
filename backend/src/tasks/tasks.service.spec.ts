import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';

describe('TasksService relationship validation', () => {
  function createService() {
    return new TasksService({
      project: { findUnique: jest.fn() },
      user: { findUnique: jest.fn(), count: jest.fn() },
    } as never);
  }

  it('rejects an unknown project', async () => {
    const service = createService();
    const prisma = (service as unknown as { prisma: { project: { findUnique: jest.Mock }; user: { findUnique: jest.Mock } } }).prisma;
    prisma.project.findUnique.mockResolvedValue(null);
    prisma.user.findUnique.mockResolvedValue({ id: 1 });

    await expect(service.ensureReferences(99, 1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects duplicate task members', async () => {
    const service = createService();
    const prisma = (service as unknown as { prisma: { project: { findUnique: jest.Mock }; user: { findUnique: jest.Mock } } }).prisma;
    prisma.project.findUnique.mockResolvedValue({ id: 1 });
    prisma.user.findUnique.mockResolvedValue({ id: 1 });

    await expect(service.ensureReferences(1, 1, [2, 2])).rejects.toBeInstanceOf(BadRequestException);
  });
});