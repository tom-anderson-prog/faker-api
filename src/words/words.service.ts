import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WordsService {
  constructor(private prisma: PrismaService) {}

  async getRandomWord(lang: 'en' | 'es' | 'cn') {
    // 先取总数再随机
    const data = await this.prisma.word.findMany({
      where: { lang },
    });
    const count = data.length;
    if (count === 0) return { word: null };

    const skip = Math.floor(Math.random() * count);
    const randomWord = data.slice(skip, 1);

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
