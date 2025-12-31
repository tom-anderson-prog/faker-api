import type {
  PhotoModel,
  PhotoCreateInput,
  PhotoUpdateInput,
} from './../../generated/prisma/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  create(data: PhotoCreateInput) {
    return this.prisma.photo.create({ data });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.photo.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.photo.count(),
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

  async findOne(id: number): Promise<PhotoModel | null> {
    return this.prisma.photo.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: PhotoUpdateInput) {
    const existing = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return this.prisma.photo.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return this.prisma.photo.delete({
      where: { id },
    });
  }
}
