import type {
  TodoCreateInput,
  TodoUpdateInput,
} from './../../generated/prisma/models';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: TodoCreateInput) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(@Query('page') pageStr: string, @Query('limit') limitStr: string) {
    const page = pageStr ? +pageStr : 1;
    const limit = limitStr ? +limitStr : 10;
    return this.todosService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const todo = await this.todosService.findOne(+id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: TodoUpdateInput) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(+id);
  }
}
