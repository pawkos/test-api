import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn().mockReturnValue(true) })
    .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call the login method of the AuthService', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'test',
        password: 'test',
      };

      (service.login as jest.Mock).mockResolvedValue({ username: 'test', access_token: 'token' });

      const result = await controller.login(loginUserDto);
      expect(result).toEqual({ username: 'test', access_token: 'token' });
    });
  });

  describe('getProfile', () => {
    it('should return the user profile from the request', () => {
      const mockRequest = {
        user: { id: 1, username: 'test' },
      };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });
  });
});
