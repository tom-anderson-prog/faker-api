import type {
  UserCreateInput,
  UserModel,
  UserUpdateInput,
} from 'generated/prisma/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, nameLike: string = '') {
    const skip = (page - 1) * limit;
    const where = nameLike
      ? { name: { contains: nameLike, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.user.count({ where }),
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

  findOne(id: number): Promise<UserModel | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  create(data: UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, data: UserUpdateInput) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
