import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { getModelToken } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userModel: typeof User;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<typeof User>(getModelToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = { username: 'test', password: 'test' };
      (userModel.findOne as jest.Mock).mockResolvedValueOnce(null);
      (userModel.create as jest.Mock).mockResolvedValueOnce(createUserDto);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed_password');

      const result = await service.create(createUserDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { username: 'test' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('test', 10);
      expect(userModel.create).toHaveBeenCalledWith({
        username: 'test',
        password: 'hashed_password',
      });
      expect(result).toEqual(createUserDto);
    });

    it('should throw ConflictException if username already exists', async () => {
      const createUserDto: CreateUserDto = { username: 'test', password: 'test' };
      (userModel.findOne as jest.Mock).mockResolvedValueOnce({ id: '1', username: 'test' });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user data without password if validation is successful', async () => {
      const user = { id: '1', username: 'test', password: 'hashedPassword', toJSON: jest.fn().mockReturnValue({
        id: '1',
        username: 'test',
        password: 'hashedPassword',
      }) };
      (userModel.findOne as jest.Mock).mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser('test', 'test');

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { username: 'test' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('test', 'hashedPassword');
      expect(result).toEqual({ id: '1', username: 'test' });
    });

    it('should return null if validation fails', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.validateUser('test', 'test');

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { username: 'test' } });
      expect(result).toBeNull();
    });
  });
});
