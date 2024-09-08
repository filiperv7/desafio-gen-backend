import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerUsecase } from './use-case/create/create-answer.usecase';
import { RemoveAnswerUsecase } from './use-case/remove/remove-answer.usecase';

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
          provide: CreateAnswerUsecase,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: RemoveAnswerUsecase,
          useValue: {
            removeAnswer: jest.fn(),
          },
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
