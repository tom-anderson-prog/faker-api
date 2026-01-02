import { Controller, Get, Param, Delete } from '@nestjs/common';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get('random-word')
  findRandomOne(lang: 'en' | 'cn' | 'es' = 'en') {
    if (lang !== 'cn' && lang !== 'en' && lang !== 'es') {
      lang = 'en';
    }
    return this.wordsService.getRandomWord(lang);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wordsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wordsService.remove(+id);
  }
}
