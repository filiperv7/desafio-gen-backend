import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionInput } from './dto/create-question.input';
import { CreateTagInput } from './dto/create-tag.input';
import { SearchInput } from './dto/search.input';
import { Question } from './entities/question.entity';
import { Tag } from './entities/tag.entity';
import { QuestionsService } from './questions.service';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let questionRepository: Repository<Question>;
  let tagRepository: Repository<Tag>;
  let jwtService: JwtService;

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
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    questionRepository = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new question successfully', async () => {
      const createQuestionInput: CreateQuestionInput = {
        title: 'Sample Question',
        description: 'Sample description',
        tags: [{ tag_name: 'tag1' }, { tag_name: 'tag2' }] as CreateTagInput[],
      };

      const mockToken = 'Bearer sample.jwt.token';
      const decodedToken = { id: 1 };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(questionRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(tagRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(tagRepository, 'save').mockImplementation((tag) => {
        return Promise.resolve({
          id: Math.random(),
          tag_name: tag.tag_name,
        } as Tag);
      });
      jest.spyOn(questionRepository, 'save').mockResolvedValue({
        id: 1,
        ...createQuestionInput,
        user_id: decodedToken.id,
        tags: [
          { id: 1, tag_name: 'tag1' },
          { id: 2, tag_name: 'tag2' },
        ],
      } as Question);

      const result = await service.create(createQuestionInput, mockToken);

      expect(result).toEqual({
        id: 1,
        ...createQuestionInput,
        userId: decodedToken.id,
        tags: [
          { id: 1, tag_name: 'tag1' },
          { id: 2, tag_name: 'tag2' },
        ],
      });
    });

    it('should throw ConflictException if question already exists', async () => {
      const createQuestionInput: CreateQuestionInput = {
        title: 'Sample Question',
        description: 'Sample description',
        tags: [],
      };

      const mockToken = 'Bearer sample.jwt.token';
      const decodedToken = { id: 1 };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest
        .spyOn(questionRepository, 'findOneBy')
        .mockResolvedValue({} as Question);

      await expect(
        service.create(createQuestionInput, mockToken),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    const mockQuestions: Question[] = [
      {
        id: 1,
        title: 'Question 1',
        description: 'Description 1',
        tags: [
          { id: 1, tag_name: 'Tag 1' },
          { id: 2, tag_name: 'Tag 2' },
        ],
        user: { id: 1, username: 'user1' } as any,
        user_id: 1,
      } as Question,
    ];

    it('should return questions with specified tags', async () => {
      const searchInput: SearchInput = {
        filter_tag_ids: [1, 2],
      };

      jest.spyOn(questionRepository, 'createQueryBuilder').mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockQuestions),
      } as any);

      const result = await service.findAll('token', searchInput);

      expect(result).toEqual(mockQuestions);
    });

    it('should return questions from the user only', async () => {
      const searchInput: SearchInput = {
        only_mine: true,
      };

      const decodedToken = { id: 1 };
      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);

      jest.spyOn(questionRepository, 'find').mockResolvedValue(mockQuestions);

      const result = await service.findAll('token', searchInput);

      expect(result).toEqual(mockQuestions);
    });

    it('should return all questions if searchInput is undefined', async () => {
      jest.spyOn(questionRepository, 'find').mockResolvedValue(mockQuestions);

      const result = await service.findAll('token');

      expect(result).toEqual(mockQuestions);
    });
  });
});
