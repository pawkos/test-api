import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ username: 'test', password: 'test' }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate a user', async () => {
    expect(await service.validateUser('test', 'test')).toEqual({ username: 'test' });
  });

  it('should return null if validation fails', async () => {
    jest.spyOn(service, 'validateUser').mockResolvedValueOnce(null);
    expect(await service.validateUser('wrong', 'wrong')).toBeNull();
  });

  it('should generate a JWT token', async () => {
    expect(await service.login({ username: 'test', userId: 1 })).toEqual({
      access_token: 'token',
    });
  });
});
