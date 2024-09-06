import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
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

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ username: string, access_token: string }> {
    const { username } = loginUserDto;
    const user = await this.userModel.findOne({ where: { username } });

    if (!user) {
      throw new Error('User not found');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      username: user.username,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}