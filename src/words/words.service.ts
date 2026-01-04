import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WordsService {
  constructor(private prisma: PrismaService) {}

  async getRandomWord(langInput: string = 'en') {
    const lang = langInput.toLowerCase() as 'en' | 'cn' | 'es';

    const count = await this.prisma.word.count({
      where: { lang: lang }, // 直接传字符串，大部分 7.x 环境能跑通
    });

    if (count === 0) return { word: null };

    const skip = Math.floor(Math.random() * count);

    const [record] = await this.prisma.word.findMany({
      where: { lang: lang },
      skip,
      take: 1,
      select: { word: true },
    });

    return { word: record?.word ?? null };
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
