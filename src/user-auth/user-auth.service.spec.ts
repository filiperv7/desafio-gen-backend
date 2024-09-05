import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAuthJwt } from '../utils/login-auth-jwt.util';
import { CreateUserAuthInput } from './dto/create-user-auth.input';
import { LoginInput } from './dto/login.input';
import { UserAuth } from './entities/user-auth.entity';
import { UserJwtOutput } from './output/user-jwt.output';
import { UserAuthService } from './user-auth.service';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UserAuthService', () => {
  let service: UserAuthService;
  let repository: Repository<UserAuth>;
  let loginAuthJwt: LoginAuthJwt;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: getRepositoryToken(UserAuth),
          useClass: Repository,
        },
        {
          provide: LoginAuthJwt,
          useValue: {
            generateJwtToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
    repository = module.get<Repository<UserAuth>>(getRepositoryToken(UserAuth));
    loginAuthJwt = module.get<LoginAuthJwt>(LoginAuthJwt);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserAuthInput: CreateUserAuthInput = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        nick_name: 'johndoe',
        password: 'securepassword',
        position: 'developer',
      };

      const hashedPassword = 'hashedpassword';

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...createUserAuthInput,
        id: 1,
        password: hashedPassword,
      } as UserAuth);

      const result = await service.create(createUserAuthInput);

      expect(result).toEqual({
        id: 1,
        ...createUserAuthInput,
        password: hashedPassword,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserAuthInput: CreateUserAuthInput = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        nick_name: 'johndoe',
        password: 'securepassword',
        position: 'developer',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue({
        ...createUserAuthInput,
        id: 1,
      } as UserAuth);

      await expect(service.create(createUserAuthInput)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      const loginInput: LoginInput = {
        nick_name: 'johndoe',
        password: 'securepassword',
      };

      const user: Partial<UserAuth> = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        nick_name: 'johndoe',
        password: 'hashedpassword',
        position: 'developer',
        questions: [],
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user as UserAuth);

      const tokenOutput: UserJwtOutput = {
        access_token: 'jwt-token',
        expires_in: '24h',
        token_type: 'bearer',
      };

      jest.spyOn(loginAuthJwt, 'generateJwtToken').mockResolvedValue({
        token: 'jwt-token',
        expireIn: '24h',
      });

      const result = await service.login(loginInput);

      expect(result).toEqual(tokenOutput);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginInput: LoginInput = {
        nick_name: 'johndoe',
        password: 'wrongpassword',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        nick_name: 'johndoe',
        password: 'hashedpassword',
        position: 'developer',
        questions: [],
      } as UserAuth);

      jest.mock('bcrypt', () => ({
        compare: jest.fn().mockResolvedValue(false),
      }));

      await expect(service.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginInput: LoginInput = {
        nick_name: 'johndoe',
        password: 'securepassword',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.login(loginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
