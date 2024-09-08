import { Test, TestingModule } from '@nestjs/testing';
import { LoginAuthJwt } from '../utils/login-auth-jwt.util';
import { CreateUserUsecase } from './use-cases/create/create-user.usecase';
import { LoginUsecase } from './use-cases/login/login.usecase';
import { UserAuthService } from './user-auth.service';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UserAuthService', () => {
  let service: UserAuthService;
  let createUserUsecase: CreateUserUsecase;
  let loginUsecase: LoginUsecase;
  let loginAuthJwt: LoginAuthJwt;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: CreateUserUsecase,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: LoginUsecase,
          useValue: {
            login: jest.fn(),
          },
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
    createUserUsecase = module.get<CreateUserUsecase>(CreateUserUsecase);
    loginUsecase = module.get<LoginUsecase>(LoginUsecase);
    loginAuthJwt = module.get<LoginAuthJwt>(LoginAuthJwt);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
