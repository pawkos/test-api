import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    // Check if username or email already exists
    const existingUser = await this.userModel.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.create({ username, password: hashedPassword });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        username,
      },
    });
  }

  async remove(username: string): Promise<void> {
    const user = await this.findOne(username);
    if (user) {
      await user.destroy();
    }
  }
}