import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../answers/entities/answer.entity';
import { Question } from './entities/question.entity';
import { Tag } from './entities/tag.entity';
import { QuestionsService } from './questions.service';
import { CreateQuestionUsecase } from './use-case/create/create-question.usecase';
import { FindAllQuestionsUsecase } from './use-case/find-all/find-all-questions.usecase';
import { FindOneQuestionUsecase } from './use-case/find-one/find-one-question.usecase';
import { FindTagsUsecase } from './use-case/find-tags/find-tags.usecase';
import { RemoveQuestionUsecase } from './use-case/remove/remove-question.usecase';
import { UpdateQuestionUsecase } from './use-case/update/update-question.usecase';

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(Question),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Answer),
          useClass: Repository,
        },
        {
          provide: CreateQuestionUsecase,
          useValue: { create: jest.fn() },
        },
        {
          provide: FindAllQuestionsUsecase,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: FindOneQuestionUsecase,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: FindTagsUsecase,
          useValue: {
            findTags: jest.fn(),
          },
        },
        {
          provide: UpdateQuestionUsecase,
          useValue: { update: jest.fn() },
        },
        {
          provide: RemoveQuestionUsecase,
          useValue: {
            remove: jest.fn(),
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

    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
