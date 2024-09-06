import { Test, TestingModule } from '@nestjs/testing';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';

const usersArray = [
  {
    username: 'username1',
    password: 'password1',
  },
  {
    username: 'username2',
    password: 'password2',
  },
];

const oneUser = {
  username: 'username1',
  password: 'password1',
};

describe('UserService', () => {
  let service: UsersService;
  let model: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            findAll: jest.fn(() => usersArray),
            findOne: jest.fn(),
            create: jest.fn(() => oneUser),
            remove: jest.fn(),
            destroy: jest.fn(() => oneUser),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<typeof User>(getModelToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a user', () => {
      const oneUser = {
        username: 'username1',
        password: 'password1',
      };
      expect(
        service.create({
          username: 'username1',
          password: 'password1',
        }),
      ).resolves.toStrictEqual(oneUser);
    });
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(usersArray);
    });
  });

  describe('findOne()', () => {
    it('should get a single user', () => {
      const findSpy = jest.spyOn(model, 'findOne');
      expect(service.findOne('username1'));
      expect(findSpy).toHaveBeenCalledWith({ where: { username: 'username1' } });
    });
  });

  describe('remove()', () => {
    it('should remove a user', async () => {
      const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: jest.fn(),
      } as any);
      const retVal = await service.remove('username2');
      expect(findSpy).toHaveBeenCalledWith({ where: { username: 'username2' } });
      expect(retVal).toBeUndefined();
    });
  });
});