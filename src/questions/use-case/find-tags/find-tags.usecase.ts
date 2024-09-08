import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Tag } from '../../entities/tag.entity';
import { FindQuestionRepository } from '../../repositories/find-question.repository';

@Injectable()
export class FindTagsUsecase {
  constructor(
    private readonly findQuestionRepository: FindQuestionRepository,
  ) {}

  async findTags(): Promise<Tag[]> {
    const tags = await this.findQuestionRepository.findTags();

    if (tags) {
      if (tags.length === 0)
        throw new NotFoundException('Nenhuma Tag encontrada!');

      return tags;
    }

    throw new InternalServerErrorException('Erro ao buscar tags!');
  }
}
