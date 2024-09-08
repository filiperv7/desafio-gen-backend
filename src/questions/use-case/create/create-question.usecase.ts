import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from '../../../utils/decode-token.util';
import { CreateQuestionInput } from '../../dto/create-question.input';
import { Question } from '../../entities/question.entity';
import { CreateQuestionRepository } from '../../repositories/create-question.repository';
import { CreateTagRepository } from '../../repositories/create-tag.repository';
import { FindQuestionRepository } from '../../repositories/find-question.repository';

@Injectable()
export class CreateQuestionUsecase {
  constructor(
    private readonly findQuestionRepository: FindQuestionRepository,
    private readonly createQuestionRepository: CreateQuestionRepository,
    private readonly createTagRepository: CreateTagRepository,
    private readonly jwt: JwtService,
  ) {}

  async create(
    createQuestionInput: CreateQuestionInput,
    token: string,
  ): Promise<Question> {
    const userId = decodeToken(token, this.jwt);

    const alreadyExist = await this.findQuestionRepository.checkIfExist(
      createQuestionInput.title,
      userId,
    );

    if (!alreadyExist) {
      const tags = await Promise.all(
        createQuestionInput.tags.map(async (tagInput) => {
          let tag = tagInput;

          if (!tagInput.id) {
            const tagAlreadyExist =
              await this.findQuestionRepository.findOneTag(tagInput.tag_name);

            if (tagAlreadyExist) tag = tagAlreadyExist;
            else {
              const tagCreated = await this.createTagRepository.createTag(
                tagInput.tag_name,
              );

              if (tagCreated) tag = tagCreated;
            }
          }

          return tag;
        }),
      );

      const questionCreated =
        await this.createQuestionRepository.createQuestion({
          ...createQuestionInput,
          user_id: userId,
          tags: tags,
        } as Question);

      if (questionCreated) return questionCreated;

      throw new InternalServerErrorException('Erro ao criar pergunta!');
    }

    throw new ConflictException('Você já fez esta pergunta');
  }
}
