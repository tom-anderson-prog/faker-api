import type {
  PostCreateInput,
  PostUpdateInput,
} from './../../generated/prisma/models';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('search') searchStr?: string,
    @Query('userId') userId?: string,
  ) {
    const page = pageStr ? +pageStr : 1;
    const limit = limitStr ? +limitStr : 10;
    return this.postsService.findAll(page, limit, searchStr, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(+id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  @Get(':id/comments')
  findPostComments(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findPostComments(id);
  }

  @Post()
  create(@Body() createPostDto: PostCreateInput) {
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: PostUpdateInput) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updatePostDto: PostUpdateInput) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
