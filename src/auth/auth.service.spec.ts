import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: '1', username: 'test', password: 'test' }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
          },
        },
        {
          provide: bcrypt,
          useValue: {
            compare: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should login successfully', async () => {
    const bcryptCompare = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
    expect(await service.login('test', 'test')).toEqual({ username: 'test', access_token: expect.any(String) });
  });

  it('should throw UnauthorizedException when user not found', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(null);
    await expect(service.login('wrong', 'wrong')).rejects.toThrow(UnauthorizedException);
    //const bcryptCompare = jest.fn().mockRejectedValue(new Error('Random error'));
    //(bcrypt.compare as jest.Mock) = bcryptCompare;
    //jest.spyOn(service, 'login').mockResolvedValueOnce(null);
    //expect(await service.login('wrong', 'wrong')).toBeNull();
  });

  it('should throw UnauthorizedException when password is incorrect', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
    await expect(service.login('test', 'test')).rejects.toThrow(UnauthorizedException);
  });
});
