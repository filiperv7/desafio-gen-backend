import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAuthJwt } from '../utils/login-auth-jwt.util';
import { UserAuth } from './entities/user-auth.entity';
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
          provide: getRepositoryToken(UserAuth),
          useClass: Repository, // Fornecendo o repositório no contexto do teste
        },
        {
          provide: LoginAuthJwt,
          useValue: {
            generateJwtToken: jest.fn(),
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
