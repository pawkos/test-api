import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todo } from './todo.model';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private todoModel: typeof Todo,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoModel.findAll();
  }

  async findOne(id: number): Promise<Todo> {
    return this.todoModel.findByPk(id);
  }

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const todo = new Todo();
    todo.title = createTodoDto.title;
    todo.userId = userId;
    return todo.save();
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<[number, Todo[]]> {
    return this.todoModel.update(updateTodoDto, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id);
    await todo.destroy();
  }
}