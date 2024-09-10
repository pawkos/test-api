import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

describe('TodoService', () => {
  let service: TodoService;
  let mockTodoModel: any;

  beforeEach(async () => {
    mockTodoModel = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken(Todo),
          useValue: mockTodoModel,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result = [{ id: 1, title: 'Test todo', userId: 1 }];
      mockTodoModel.findAll.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const result = { id: 1, title: 'Test todo', userId: 1 };
      mockTodoModel.findByPk.mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
      expect(mockTodoModel.findByPk).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const id = 1;
      const updateTodoDto: UpdateTodoDto = { title: 'Updated todo' };
      const updatedTodo = { id, ...updateTodoDto };
      mockTodoModel.update.mockResolvedValue([1, [updatedTodo]]);

      const result = await service.update(id, updateTodoDto);

      expect(result).toEqual([1, [updatedTodo]]);
      expect(mockTodoModel.update).toHaveBeenCalledWith(updateTodoDto, {
        where: { id },
        returning: true,
      });
    });
  });
});