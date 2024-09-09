import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            create: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com', password: 'testtest' };
      const result = { id: '1', email: 'test@test.com' } as User;

      jest.spyOn(authService, 'create').mockResolvedValue({
        user: result,
        email: result.email,
        access_token: 'some_token'
      });

      expect(await authController.register(createUserDto)).toStrictEqual({
        'access_token': 'some_token',
        'email': 'test@test.com',
        'user': {
          'email': 'test@test.com',
          'id': '1'
        },
      });
      expect(authService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@test.com', password: 'testtest' };
      const result = { email: 'test@test.com', access_token: 'some_token' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginUserDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });
});
