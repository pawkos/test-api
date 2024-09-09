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

  async create(createUserDto: CreateUserDto): Promise<{ user: User, email: string, access_token: string }> {
    const { email, password } = createUserDto;

    // Check if email or email already exists
    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ email, password: hashedPassword });

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return { 
      user,
      email: user.email,
      access_token
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<{ email: string, access_token: string }> {
    const { email } = loginUserDto;
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new ConflictException('User not found');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      email: user.email,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}