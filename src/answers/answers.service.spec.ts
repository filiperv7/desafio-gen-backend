import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerUsecase } from './use-case/create/create-answer.usecase';
import { RemoveAnswerUsecase } from './use-case/remove/remove-answer.usecase';

describe('AnswersService', () => {
  let service: AnswersService;
  let createAnswerUsecase: CreateAnswerUsecase;
  let removeAnswerUsecase: RemoveAnswerUsecase;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<AnswersService>(AnswersService);
    createAnswerUsecase = module.get<CreateAnswerUsecase>(CreateAnswerUsecase);
    removeAnswerUsecase = module.get<RemoveAnswerUsecase>(RemoveAnswerUsecase);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
