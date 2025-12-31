import type {
  PhotoCreateInput,
  PhotoUpdateInput,
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
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  create(@Body() createPhotoDto: PhotoCreateInput) {
    return this.photosService.create(createPhotoDto);
  }

  @Get()
  findAll(@Query('page') pageStr: string, @Query('limit') limitStr: string) {
    const page = pageStr ? +pageStr : 1;
    const limit = limitStr ? +limitStr : 10;
    return this.photosService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const photo = await this.photosService.findOne(+id);
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return photo;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhotoDto: PhotoUpdateInput) {
    return this.photosService.update(+id, updatePhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photosService.remove(+id);
  }
}
