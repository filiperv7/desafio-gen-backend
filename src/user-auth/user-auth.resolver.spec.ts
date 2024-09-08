import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUsecase } from './use-cases/create/create-user.usecase';
import { LoginUsecase } from './use-cases/login/login.usecase';
import { UserAuthResolver } from './user-auth.resolver';
import { UserAuthService } from './user-auth.service';

describe('UserAuthResolver', () => {
  let resolver: UserAuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthResolver,
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
      ],
    }).compile();

    resolver = module.get<UserAuthResolver>(UserAuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
