import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FindAnswerRepository } from './../../repositories/find-answer.repository';
import { RemoveAnswerRepository } from './../../repositories/remove-answer.repository';
import { RemoveAnswerUsecase } from './remove-answer.usecase';

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}));

describe('RemoveAnswerUsecase', () => {
  let usecase: RemoveAnswerUsecase;
  let findAnswerRepository: FindAnswerRepository;
  let removeAnswerRepository: RemoveAnswerRepository;
  let jwtService: JwtService;

  beforeEach(() => {
    findAnswerRepository = new FindAnswerRepository(null);
    removeAnswerRepository = new RemoveAnswerRepository(null);
    jwtService = new JwtService();
    usecase = new RemoveAnswerUsecase(
      findAnswerRepository,
      removeAnswerRepository,
      jwtService,
    );
  });

  describe('removeAnswer', () => {
    it('should remove the answer successfully', async () => {
      const answerId = 1;
      const mockUserId = 1;
      const token = 'Bearer validtoken';
      const answer = { id: answerId, user_id: mockUserId } as any;

      jest
        .spyOn(jwtService, 'decode')
        .mockReturnValue({ id: mockUserId } as any);
      jest.spyOn(findAnswerRepository, 'findOne').mockResolvedValue(answer);
      jest.spyOn(removeAnswerRepository, 'remove').mockResolvedValue(true);

      const result = await usecase.removeAnswer(answerId, token);

      expect(result).toEqual(answer);
    });

    it('should throw NotFoundException if answer does not exist', async () => {
      const answerId = 1;
      const token = 'Bearer validtoken';

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 } as any);
      jest.spyOn(findAnswerRepository, 'findOne').mockResolvedValue(false);

      await expect(usecase.removeAnswer(answerId, token)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if user is not the author', async () => {
      const answerId = 1;
      const token = 'Bearer validtoken';
      const answer = { id: answerId, user_id: 2 } as any; // User ID mismatch

      jest.spyOn(jwtService, 'decode').mockReturnValue({ id: 1 } as any);
      jest.spyOn(findAnswerRepository, 'findOne').mockResolvedValue(answer);

      await expect(usecase.removeAnswer(answerId, token)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
