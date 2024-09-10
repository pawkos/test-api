import { CreateUserDto } from './create-user.dto';
import { validate } from 'class-validator';

describe('CreateUserDto', () => {
  it('should validate successfully with valid input', async () => {
    const createUserDto = new CreateUserDto();
    createUserDto.email = 'test@test.com';
    createUserDto.password = 'testtest';

    const errors = await validate(createUserDto);
    expect(errors).toEqual([]);
  });

  it('should validate with errors when email is empty', async () => {
    const createUserDto = new CreateUserDto();
    createUserDto.password = 'testtest';

    const errors = await validate(createUserDto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toStrictEqual({ isEmail: 'email must be an email', isNotEmpty: 'email should not be empty' });
  });

  it('should validate with errors when email is not a valid email', async () => {
    const createUserDto = new CreateUserDto();
    createUserDto.email = 'invalid-email';
    createUserDto.password = 'testtest';

    const errors = await validate(createUserDto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({ isEmail: 'email must be an email' });
  });

  it('should validate with errors when password is empty', async () => {
    const createUserDto = new CreateUserDto();
    createUserDto.email = 'test@test.com';

    const errors = await validate(createUserDto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({ isString: 'password must be a string', minLength: 'password must be longer than or equal to 6 characters' });
  });

  it('should validate with errors when password is too short', async () => {
    const createUserDto = new CreateUserDto();
    createUserDto.email = 'test@test.com';
    createUserDto.password = 'short';

    const errors = await validate(createUserDto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({ minLength: 'password must be longer than or equal to 6 characters' });
  });
});