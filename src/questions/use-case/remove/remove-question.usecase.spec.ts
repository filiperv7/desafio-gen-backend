import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from '../../../utils/decode-token.util';
import { Question } from '../../entities/question.entity';
import { FindQuestionRepository } from '../../repositories/find-question.repository';
import { RemoveQuestionRepository } from '../../repositories/remove-question.repository';
import { RemoveQuestionUsecase } from './remove-question.usecase';

jest.mock('../../../utils/decode-token.util', () => ({
  decodeToken: jest.fn(), // Simule a função decodeToken
}));

describe('RemoveQuestionUsecase', () => {
  let usecase: RemoveQuestionUsecase;
  let findRepository: FindQuestionRepository;
  let removeRepository: RemoveQuestionRepository;
  let jwtService: JwtService;

  beforeEach(() => {
    findRepository = new FindQuestionRepository(null, null);
    removeRepository = new RemoveQuestionRepository(null, null);
    jwtService = new JwtService();
    usecase = new RemoveQuestionUsecase(
      findRepository,
      removeRepository,
      jwtService,
    );
  });

  it('should throw NotFoundException if question not found', async () => {
    jest.spyOn(findRepository, 'findOneQuestion').mockResolvedValue(null);

    await expect(usecase.remove(1, 'token')).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if user is not the owner', async () => {
    const question = { id: 1, user_id: 2 } as Question;
    jest.spyOn(findRepository, 'findOneQuestion').mockResolvedValue(question);
    (decodeToken as jest.Mock).mockReturnValue(1);

    await expect(usecase.remove(1, 'token')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw InternalServerErrorException if answers cannot be deleted', async () => {
    const question = { id: 1, user_id: 1, answers: [{ id: 1 }] } as Question;
    jest.spyOn(findRepository, 'findOneQuestion').mockResolvedValue(question);
    (decodeToken as jest.Mock).mockReturnValue(1);
    jest.spyOn(removeRepository, 'deleteAnswers').mockResolvedValue(false);

    await expect(usecase.remove(1, 'token')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException if question cannot be deleted', async () => {
    const question = { id: 1, user_id: 1, answers: [] } as Question;
    jest.spyOn(findRepository, 'findOneQuestion').mockResolvedValue(question);
    (decodeToken as jest.Mock).mockReturnValue(1);
    jest.spyOn(removeRepository, 'deleteAnswers').mockResolvedValue(true);
    jest.spyOn(removeRepository, 'deleteQuestion').mockResolvedValue(false);

    await expect(usecase.remove(1, 'token')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should remove question successfully', async () => {
    const question = { id: 1, user_id: 1, answers: [] } as Question;

    jest.spyOn(findRepository, 'findOneQuestion').mockResolvedValue(question);
    (decodeToken as jest.Mock).mockReturnValue(1);
    jest.spyOn(removeRepository, 'deleteAnswers').mockResolvedValue(true);
    jest.spyOn(removeRepository, 'deleteQuestion').mockResolvedValue(true);

    const result = await usecase.remove(1, 'token');

    expect(result).toBe(question);
  });
});
