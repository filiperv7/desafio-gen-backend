import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAnswerInput } from '../../dto/create-answer.input';
import { Answer } from '../../entities/answer.entity';
import { CreateAnswerRepository } from '../../repositories/create-answer.repository';
import { CreateAnswerUsecase } from './create-answer.usecase';

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}));

describe('CreateAnswerUsecase', () => {
  let usecase: CreateAnswerUsecase;
  let createAnswerRepository: CreateAnswerRepository;
  let jwtService: JwtService;

  beforeEach(() => {
    createAnswerRepository = new CreateAnswerRepository(null);
    jwtService = new JwtService();
    usecase = new CreateAnswerUsecase(createAnswerRepository, jwtService);
  });

  describe('create', () => {
    it('should create a new answer successfully', async () => {
      const createAnswerInput: CreateAnswerInput = {
        content: 'This is an answer',
        question_id: 1,
      };

      const mockUserId = 1;
      const token = 'Bearer validtoken';
      const answerCreated: Answer = {
        id: 1,
        ...createAnswerInput,
        user_id: mockUserId,
      } as Answer;

      jest
        .spyOn(jwtService, 'decode')
        .mockReturnValue({ id: mockUserId } as any);
      jest
        .spyOn(createAnswerRepository, 'create')
        .mockResolvedValue(answerCreated);

      const result = await usecase.create(createAnswerInput, token);

      expect(result).toEqual(answerCreated);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const createAnswerInput: CreateAnswerInput = {
        content: 'This is an answer',
        question_id: 1,
      };

      const token = 'Bearer validtoken';
      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 } as any);
      jest.spyOn(createAnswerRepository, 'create').mockResolvedValue(false);

      await expect(usecase.create(createAnswerInput, token)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
