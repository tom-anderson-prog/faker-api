import type {
  TodoModel,
  TodoCreateInput,
  TodoUpdateInput,
} from './../../generated/prisma/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  create(data: TodoCreateInput) {
    return this.prisma.todo.create({
      data,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.todo.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.todo.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<TodoModel | null> {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: TodoUpdateInput) {
    const existing = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
