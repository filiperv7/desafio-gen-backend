import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from '../../../utils/decode-token.util';
import { CreateQuestionInput } from '../../dto/create-question.input';
import { Question } from '../../entities/question.entity';
import { CreateQuestionRepository } from '../../repositories/create-question.repository';
import { CreateTagRepository } from '../../repositories/create-tag.repository';
import { FindQuestionRepository } from '../../repositories/find-question.repository';
import { CreateQuestionUsecase } from './create-question.usecase';

jest.mock('../../../utils/decode-token.util', () => ({
  decodeToken: jest.fn(),
}));

describe('CreateQuestionUsecase', () => {
  let usecase: CreateQuestionUsecase;
  let findQuestionRepository: FindQuestionRepository;
  let createQuestionRepository: CreateQuestionRepository;
  let createTagRepository: CreateTagRepository;
  let jwtService: JwtService;

  beforeEach(() => {
    findQuestionRepository = new FindQuestionRepository(null, null);
    createQuestionRepository = new CreateQuestionRepository(null);
    createTagRepository = new CreateTagRepository(null);
    jwtService = new JwtService();
    usecase = new CreateQuestionUsecase(
      findQuestionRepository,
      createQuestionRepository,
      createTagRepository,
      jwtService,
    );
  });

  it('should throw ConflictException if question already exists', async () => {
    jest
      .spyOn(findQuestionRepository, 'checkIfExist')
      .mockResolvedValue({} as Question);

    await expect(
      usecase.create(
        { title: 'Test Question', tags: [] } as CreateQuestionInput,
        'token',
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw InternalServerErrorException if question creation fails', async () => {
    jest.spyOn(findQuestionRepository, 'checkIfExist').mockResolvedValue(null);
    jest
      .spyOn(createQuestionRepository, 'createQuestion')
      .mockResolvedValue(false);

    await expect(
      usecase.create(
        { title: 'Test Question', tags: [] } as CreateQuestionInput,
        'token',
      ),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should create question successfully', async () => {
    jest.spyOn(findQuestionRepository, 'checkIfExist').mockResolvedValue(null);
    jest
      .spyOn(createQuestionRepository, 'createQuestion')
      .mockResolvedValue({ id: 1, title: 'Test Question' } as Question);

    (decodeToken as jest.Mock).mockReturnValue(1);

    const result = await usecase.create(
      { title: 'Test Question', tags: [] } as CreateQuestionInput,
      'token',
    );

    expect(result).toEqual({ id: 1, title: 'Test Question' });
  });
});
