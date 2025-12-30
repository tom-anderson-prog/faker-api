import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WordsService {
  constructor(private prisma: PrismaService) {}

  async getRandomWord() {
    // 先取总数再随机
    const count = await this.prisma.word.count();
    if (count === 0) return { word: null };

    const skip = Math.floor(Math.random() * count);
    const randomWord = await this.prisma.word.findFirst({
      skip,
      select: { word: true },
    });

    return randomWord || { word: null };
  }

  findOne(id: number) {
    return this.prisma.word.findUnique({
      where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.word.delete({
      where: { id },
    });
  }
}
