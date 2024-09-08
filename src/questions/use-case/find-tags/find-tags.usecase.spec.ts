import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Tag } from '../../entities/tag.entity';
import { FindQuestionRepository } from '../../repositories/find-question.repository';
import { FindTagsUsecase } from './find-tags.usecase';

describe('FindTagsUsecase', () => {
  let usecase: FindTagsUsecase;
  let repository: FindQuestionRepository;

  beforeEach(async () => {
    repository = new FindQuestionRepository(null, null);
    usecase = new FindTagsUsecase(repository);
  });

  it('should return tags when found', async () => {
    const tags = [{ id: 1, tag_name: 'Test Tag' } as Tag];
    jest.spyOn(repository, 'findTags').mockResolvedValue(tags);

    const result = await usecase.findTags();

    expect(result).toEqual(tags);
  });

  it('should throw NotFoundException when no tags found', async () => {
    jest.spyOn(repository, 'findTags').mockResolvedValue([]);

    await expect(usecase.findTags()).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException on error', async () => {
    jest.spyOn(repository, 'findTags').mockResolvedValue(false);

    await expect(usecase.findTags()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
