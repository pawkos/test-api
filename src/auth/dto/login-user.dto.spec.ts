// src/auth/dto/login-user.dto.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserDto } from './login-user.dto';
import { validate } from 'class-validator';

describe('LoginUserDto', () => {
  it('should validate email', async () => {
    const dto = new LoginUserDto();
    dto.email = 'invalid-email';
    const errors = await validate(dto);
    expect(errors.length).toBe(2);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should validate email is not empty', async () => {
    const dto = new LoginUserDto();
    dto.email = '';
    dto.password = '';
    const errors = await validate(dto);
    expect(errors.length).toBe(2);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate valid email', async () => {
    const dto = new LoginUserDto();
    dto.email = 'test@test.com';
    dto.password = 'testtest';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});