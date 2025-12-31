import type {
  AlbumModel,
  AlbumCreateInput,
  AlbumUpdateInput,
} from './../../generated/prisma/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  create(data: AlbumCreateInput) {
    return this.prisma.album.create({
      data,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.album.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.album.count(),
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

  async findOne(id: number): Promise<AlbumModel | null> {
    return this.prisma.album.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: AlbumUpdateInput) {
    const existing = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    return this.prisma.album.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    return this.prisma.album.delete({
      where: { id },
    });
  }
}
