import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';

describe('AnswersResolver', () => {
  let resolver: AnswersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswersResolver,
        AnswersService,
        {
          provide: getRepositoryToken(Answer),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AnswersResolver>(AnswersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
