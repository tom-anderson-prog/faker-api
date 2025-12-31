import { PrismaService } from 'src/prisma/prisma.service';
import type {
  PostCreateInput,
  PostUpdateInput,
  PostModel,
} from './../../generated/prisma/models';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(data: PostCreateInput) {
    return this.prisma.post.create({
      data,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.post.count(),
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

  findPostComments(id: number) {
    return this.prisma.comment.findMany({
      where: { postId: id },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<PostModel | null> {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: PostUpdateInput) {
    const existing = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
