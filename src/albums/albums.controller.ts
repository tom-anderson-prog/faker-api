import type {
  AlbumCreateInput,
  AlbumUpdateInput,
} from './../../generated/prisma/models';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  create(@Body() createAlbumDto: AlbumCreateInput) {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  findAll(
    @Query('page') pageStr: string,
    @Query('limit') limitStr: string,
    @Query('userId') userId: string,
  ) {
    const page = pageStr ? Number(pageStr) : 1;
    const limit = limitStr ? Number(limitStr) : 10;
    return this.albumsService.findAll(page, limit, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const album = await this.albumsService.findOne(+id);

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    return album;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: AlbumUpdateInput) {
    return this.albumsService.update(+id, updateAlbumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumsService.remove(+id);
  }
}
