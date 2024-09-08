import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginAuthJwt } from '../../../utils/login-auth-jwt.util';
import { FindUserRepository } from '../../repositories/find-user.repository';
import { LoginInput } from './../../dto/login.input';
import { LoginUsecase } from './login.usecase';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('../../../utils/login-auth-jwt.util', () => {
  return {
    LoginAuthJwt: jest.fn().mockImplementation(() => ({
      generateJwtToken: jest.fn(),
    })),
  };
});

describe('LoginUsecase', () => {
  let usecase: LoginUsecase;
  let findUserRepository: FindUserRepository;
  let loginAuthJwt: LoginAuthJwt;

  beforeEach(() => {
    findUserRepository = new FindUserRepository(null);
    loginAuthJwt = new LoginAuthJwt();
    usecase = new LoginUsecase(findUserRepository, loginAuthJwt);
  });

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      const loginInput: LoginInput = {
        nick_name: 'johndoe',
        password: 'securepassword',
      };

      const user = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        nick_name: 'johndoe',
        password: 'hashedpassword',
        position: 'developer',
      };

      jest.spyOn(findUserRepository, 'findOne').mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const tokenOutput = {
        token: 'jwt-token',
        expireIn: '24h',
      };

      jest
        .spyOn(loginAuthJwt, 'generateJwtToken')
        .mockResolvedValue(tokenOutput as any);

      const result = await usecase.login(loginInput);

      expect(result).toEqual({
        access_token: 'jwt-token',
        expires_in: '24h',
        token_type: 'bearer',
      });
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginInput: LoginInput = {
        nick_name: 'johndoe',
        password: 'wrongpassword',
      };

      jest.spyOn(findUserRepository, 'findOne').mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        nick_name: 'johndoe',
        password: 'hashedpassword',
        position: 'developer',
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(usecase.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginInput: LoginInput = {
        nick_name: 'johndoe',
        password: 'securepassword',
      };

      jest.spyOn(findUserRepository, 'findOne').mockResolvedValue(false);

      await expect(usecase.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
