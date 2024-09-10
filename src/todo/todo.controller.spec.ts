import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result = ['test'];
      jest.spyOn(service, 'findAll').mockImplementation(() => result as any);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const result = { id: 1, title: 'Test Todo', description: 'Test Description' };
      jest.spyOn(service, 'findOne').mockImplementation(() => result as any);

      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodoDto: CreateTodoDto = { title: 'New Todo' };
      const result = { id: 1, ...createTodoDto };
      const req = { user: { id: 1 } };

      jest.spyOn(service, 'create').mockImplementation(() => result as any);

      expect(await controller.create(createTodoDto, req)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createTodoDto, 1);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };
      const result = { id: 1, ...updateTodoDto };

      jest.spyOn(service, 'update').mockImplementation(() => result as any);

      expect(await controller.update('1', updateTodoDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, updateTodoDto);
    });
  });
});