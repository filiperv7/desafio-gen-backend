import { NotFoundException } from '@nestjs/common';
import { Question } from '../../entities/question.entity';
import { FindQuestionRepository } from '../../repositories/find-question.repository';
import { FindOneQuestionUsecase } from './find-one-question.usecase';

describe('FindOneQuestionUsecase', () => {
  let usecase: FindOneQuestionUsecase;
  let repository: FindQuestionRepository;

  beforeEach(async () => {
    repository = new FindQuestionRepository(null, null);
    usecase = new FindOneQuestionUsecase(repository);
  });

  it('should return a question when found', async () => {
    const question = { id: 1, title: 'Test Question' } as Question;
    jest.spyOn(repository, 'findOneQuestion').mockResolvedValue(question);

    const result = await usecase.findOne(1);

    expect(result).toEqual(question);
  });

  it('should throw NotFoundException when question is not found', async () => {
    jest.spyOn(repository, 'findOneQuestion').mockResolvedValue(false);

    await expect(usecase.findOne(1)).rejects.toThrow(NotFoundException);
  });
});
