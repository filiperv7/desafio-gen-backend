import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Answer } from 'src/answers/entities/answer.entity';
import { UserAuth } from 'src/user-auth/entities/user-auth.entity';
import { Repository } from 'typeorm';
import { CreateQuestionInput } from './dto/create-question.input';
import { CreateTagInput } from './dto/create-tag.input';
import { SearchInput } from './dto/search.input';
import { UpdateQuestionInput } from './dto/update-question.input';
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
        user_id: decodedToken.id,
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

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 });

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

  describe('findOne', () => {
    it('should return a complete question with user, tags, and answers', async () => {
      const id = 1;
      const mockQuestion: Partial<Question> = {
        id,
        title: 'Sample Question',
        description: 'Sample description',
        creation_date: new Date(),
        user: { id: 1, name: 'user1' } as UserAuth,
        tags: [{ id: 1, tag_name: 'tag1' }] as Tag[],
        answers: [
          {
            content: 'Answer content',
            creation_date: new Date(),
            user: { id: 2, name: 'user2' } as any,
          },
        ] as Answer[],
      };

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockQuestion),
      };

      jest
        .spyOn(questionRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);

      const result = await service.findOne(id);

      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundException if the question is not found', async () => {
      const id = 1;

      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      jest
        .spyOn(questionRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllTags', () => {
    it('should return all tags', async () => {
      const mockTags: Tag[] = [
        { id: 2, tag_name: 'Alpha' },
        { id: 1, tag_name: 'Beta' },
      ] as Tag[];

      jest.spyOn(tagRepository, 'find').mockResolvedValue(mockTags);

      const result = await service.findAllTags();

      expect(result).toEqual(mockTags);
    });
  });

  describe('update', () => {
    const updateQuestionInput: UpdateQuestionInput = {
      id: 3,
      title: 'Updated Question Title',
      description: 'Updated description',
      tags: [{ tag_name: 'tag1' }, { tag_name: 'tag2' }],
    };

    const mockQuestion = {
      id: 3,
      title: 'Original Question Title',
      description: 'Original description',
      user_id: 1,
      answers: [],
      tags: [],
    } as Question;

    it('should update a question successfully', async () => {
      const mockToken = 'Bearer sample.jwt.token';
      const questionId = 3;

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 });
      jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestion);
      jest.spyOn(questionRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(tagRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(tagRepository, 'save').mockImplementation((tag) => {
        return Promise.resolve({
          id: tag.tag_name === 'tag1' ? 1 : 2,
          tag_name: tag.tag_name,
        } as Tag);
      });
      jest.spyOn(questionRepository, 'save').mockResolvedValue({
        ...updateQuestionInput,
        id: questionId,
        tags: [
          { id: 1, tag_name: 'tag1' },
          { id: 2, tag_name: 'tag2' },
        ] as Tag[],
      } as Question);

      const result = await service.update(
        questionId,
        updateQuestionInput,
        mockToken,
      );

      expect(result).toEqual({
        id: questionId,
        ...updateQuestionInput,
        tags: [
          { id: 1, tag_name: 'tag1' },
          { id: 2, tag_name: 'tag2' },
        ],
        user_id: 1,
        answers: [],
      });
    });

    it('should throw NotFoundException if question is not found', async () => {
      const mockToken = 'Bearer sample.jwt.token';
      const questionId = 3;

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 });
      jest.spyOn(questionRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(questionId, updateQuestionInput, mockToken),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if the question has answers', async () => {
      const mockToken = 'Bearer sample.jwt.token';
      const questionId = 3;

      const mockQuestion = {
        id: questionId,
        title: 'Original Question Title',
        description: 'Original description',
        answers: [{ content: 'Some answer' }],
        user_id: 1,
      } as Question;

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 });
      jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestion);

      await expect(
        service.update(questionId, updateQuestionInput, mockToken),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if a question with the same title and user already exists', async () => {
      const mockToken = 'Bearer sample.jwt.token';
      const questionId = 3;

      const existingQuestion = {
        id: 3,
        title: updateQuestionInput.title,
        description: updateQuestionInput.description,
        user_id: 1,
      } as Question;

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 });
      jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestion);
      jest
        .spyOn(questionRepository, 'findOneBy')
        .mockResolvedValue(existingQuestion);

      await expect(
        service.update(questionId, updateQuestionInput, mockToken),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw UnauthorizedException if the user is not the author of the question', async () => {
      const mockToken = 'Bearer sample.jwt.token';
      const questionId = 3;

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 2 });
      jest.spyOn(questionRepository, 'findOne').mockResolvedValue(mockQuestion);

      await expect(
        service.update(questionId, updateQuestionInput, mockToken),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    const questionId = 1;
    const mockToken = 'Bearer sample.jwt.token';

    const mockQuestion = {
      id: questionId,
      title: 'Sample Question',
      description: 'Sample description',
      user_id: 1,
    } as Question;

    it('should remove a question successfully', async () => {
      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 });
      jest
        .spyOn(questionRepository, 'findOneBy')
        .mockResolvedValue(mockQuestion);
      jest.spyOn(questionRepository, 'delete').mockResolvedValue(undefined);

      const result = await service.remove(questionId, mockToken);

      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundException if question is not found', async () => {
      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 });
      jest.spyOn(questionRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(questionId, mockToken)).rejects.toThrow(
        'Pergunta não encontrada!',
      );
    });

    it('should throw UnauthorizedException if the user is not the author of the question', async () => {
      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 3 });
      jest
        .spyOn(questionRepository, 'findOneBy')
        .mockResolvedValue(mockQuestion);

      await expect(service.remove(questionId, mockToken)).rejects.toThrow(
        'Você só pode apagar suas próprias perguntas.',
      );
    });
  });
});
