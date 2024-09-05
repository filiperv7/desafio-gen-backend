import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswersService } from './answers.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { Answer } from './entities/answer.entity';

describe('AnswersService', () => {
  let service: AnswersService;
  let repository: Repository<Answer>;
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
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnswersService>(AnswersService);
    repository = module.get<Repository<Answer>>(getRepositoryToken(Answer));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an answer', async () => {
      const createAnswerInput: CreateAnswerInput = {
        content: 'Test content',
        question_id: 1,
      };
      const token = 'Bearer sample.jwt.token';
      const decodedToken = { id: 1 };
      const mockSavedAnswer: Partial<Answer> = {
        id: 3,
        content: createAnswerInput.content,
        question_id: createAnswerInput.question_id,
        user_id: decodedToken.id,
        creation_date: new Date(Date.now()),
      };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(mockSavedAnswer as Answer);

      const result = await service.create(createAnswerInput, token);

      expect(result).toEqual(mockSavedAnswer);
    });
  });

  describe('remove', () => {
    it('should remove an answer if user is the author', async () => {
      const token = 'Bearer sample.jwt.token';
      const decodedToken = { id: 1 };
      const answerId = 3;
      const mockAnswer: Partial<Answer> = {
        id: answerId,
        content: 'Test content',
        question_id: 1,
        user_id: decodedToken.id,
        creation_date: new Date(Date.now()),
      };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValue(mockAnswer as Answer);
      jest.spyOn(repository, 'delete').mockResolvedValue({} as any);

      const result = await service.remove(answerId, token);

      expect(result).toEqual(mockAnswer);
    });

    it('should throw an error if user is not the author', async () => {
      const token = 'Bearer sample.jwt.token';
      const decodedToken = { id: 1 };
      const answerId = 3;

      jest.spyOn(jwtService, 'decode').mockReturnValue(decodedToken);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(answerId, token)).rejects.toThrow(
        'Uma resposta só pode ser apagada pelo seu autor.',
      );
    });
  });
});
