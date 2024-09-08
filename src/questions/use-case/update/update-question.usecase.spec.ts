import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from '../../../utils/decode-token.util';
import { UpdateQuestionInput } from '../../dto/update-question.input';
import { Question } from '../../entities/question.entity';
import { CreateTagRepository } from '../../repositories/create-tag.repository';
import { FindQuestionRepository } from '../../repositories/find-question.repository';
import { UpdateQuestionRepository } from '../../repositories/update-question.repository';
import { UpdateQuestionUsecase } from './update-question.usecase';

jest.mock('../../../utils/decode-token.util', () => ({
  decodeToken: jest.fn(),
}));

describe('UpdateQuestionUsecase', () => {
  let usecase: UpdateQuestionUsecase;
  let findQuestionRepository: FindQuestionRepository;
  let createTagRepository: CreateTagRepository;
  let updateQuestionRepository: UpdateQuestionRepository;
  let jwtService: JwtService;

  beforeEach(() => {
    findQuestionRepository = new FindQuestionRepository(null, null);
    createTagRepository = new CreateTagRepository(null);
    updateQuestionRepository = new UpdateQuestionRepository(null);
    jwtService = new JwtService();
    usecase = new UpdateQuestionUsecase(
      jwtService,
      findQuestionRepository,
      createTagRepository,
      updateQuestionRepository,
    );
  });

  it('should throw NotFoundException if question does not exist', async () => {
    jest
      .spyOn(findQuestionRepository, 'findOneQuestion')
      .mockResolvedValue(null);

    await expect(
      usecase.update(
        1,
        { title: 'Updated Title', tags: [] } as UpdateQuestionInput,
        'token',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if user is not the owner', async () => {
    const question = { id: 1, user_id: 2, answers: [] } as Question;
    jest
      .spyOn(findQuestionRepository, 'findOneQuestion')
      .mockResolvedValue(question);
    (decodeToken as jest.Mock).mockReturnValue(1);

    await expect(
      usecase.update(
        1,
        { title: 'Updated Title', tags: [] } as UpdateQuestionInput,
        'token',
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw BadRequestException if question has answers', async () => {
    const question = { id: 1, user_id: 1, answers: [{ id: 1 }] } as Question;
    jest
      .spyOn(findQuestionRepository, 'findOneQuestion')
      .mockResolvedValue(question);
    (decodeToken as jest.Mock).mockReturnValue(1);

    await expect(
      usecase.update(
        1,
        { title: 'Updated Title', tags: [] } as UpdateQuestionInput,
        'token',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if new question title already exists', async () => {
    const question = { id: 1, user_id: 1, answers: [] } as Question;
    jest
      .spyOn(findQuestionRepository, 'findOneQuestion')
      .mockResolvedValue(question);
    jest.spyOn(findQuestionRepository, 'checkIfExist').mockResolvedValue(true);
    (decodeToken as jest.Mock).mockReturnValue(1);

    await expect(
      usecase.update(
        1,
        { title: 'Updated Title', tags: [] } as UpdateQuestionInput,
        'token',
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw InternalServerErrorException if question update fails', async () => {
    const question = { id: 1, user_id: 1, answers: [] } as Question;
    jest
      .spyOn(findQuestionRepository, 'findOneQuestion')
      .mockResolvedValue(question);
    jest.spyOn(findQuestionRepository, 'checkIfExist').mockResolvedValue(false);
    jest
      .spyOn(updateQuestionRepository, 'updateQuestion')
      .mockResolvedValue(false);
    (decodeToken as jest.Mock).mockReturnValue(1);

    await expect(
      usecase.update(
        1,
        { title: 'Updated Title', tags: [] } as UpdateQuestionInput,
        'token',
      ),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should update question successfully', async () => {
    const question = { id: 1, user_id: 1, answers: [] } as Question;
    jest
      .spyOn(findQuestionRepository, 'findOneQuestion')
      .mockResolvedValue(question);
    jest.spyOn(findQuestionRepository, 'checkIfExist').mockResolvedValue(false);
    jest
      .spyOn(updateQuestionRepository, 'updateQuestion')
      .mockResolvedValue(question);
    (decodeToken as jest.Mock).mockReturnValue(1);

    const result = await usecase.update(
      1,
      { title: 'Updated Title', tags: [] } as UpdateQuestionInput,
      'token',
    );

    expect(result).toEqual(question);
  });
});
