import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from '../../../utils/decode-token.util';
import { UpdateQuestionInput } from '../../dto/update-question.input';
import { Question } from '../../entities/question.entity';
import { Tag } from '../../entities/tag.entity';
import { CreateTagRepository } from '../../repositories/create-tag.repository';
import { FindQuestionRepository } from '../../repositories/find-question.repository';
import { UpdateQuestionRepository } from '../../repositories/update-question.repository';

@Injectable()
export class UpdateQuestionUsecase {
  constructor(
    private readonly jwt: JwtService,
    private readonly findQuestionRepository: FindQuestionRepository,
    private readonly createTagRepository: CreateTagRepository,
    private readonly updateQuestionRepository: UpdateQuestionRepository,
  ) {}

  async update(
    id: number,
    updateQuestionInput: UpdateQuestionInput,
    token: string,
  ): Promise<Question> {
    const userId = decodeToken(token, this.jwt);

    const question = await this.findQuestionRepository.findOneQuestion(id);

    if (!question) {
      throw new NotFoundException('Pergunta não encontrada!');
    }

    if (question.user_id !== userId) {
      throw new UnauthorizedException(
        'Você só pode editar suas próprias perguntas.',
      );
    }

    if (question.answers.length > 0) {
      throw new BadRequestException(
        'Esta pergunta já possui respostas, portanto não pode ser alterada.',
      );
    }

    const alreadyExist = await this.findQuestionRepository.checkIfExist(
      updateQuestionInput.title,
      userId,
      updateQuestionInput.id,
    );

    if (!alreadyExist) {
      const tags = await Promise.all(
        updateQuestionInput.tags.map(async (tagInput) => {
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

      question.title = updateQuestionInput.title;
      question.description = updateQuestionInput.description;
      question.tags = tags as Tag[];

      const questionUpdated =
        await this.updateQuestionRepository.updateQuestion(question);

      if (questionUpdated) return question;

      throw new InternalServerErrorException('Erro ao criar pergunta!');
    }

    throw new ConflictException('Você já fez esta pergunta!');
  }
}
