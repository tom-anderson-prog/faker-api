import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ReviewCreateInput } from './../../generated/prisma/models';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, username: string, data: ReviewCreateInput) {
    return this.prisma.review.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        username,
        customer: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
