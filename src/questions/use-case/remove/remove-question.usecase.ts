import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from '../../../utils/decode-token.util';
import { Question } from '../../entities/question.entity';
import { FindQuestionRepository } from '../../repositories/find-question.repository';
import { RemoveQuestionRepository } from '../../repositories/remove-question.repository';

@Injectable()
export class RemoveQuestionUsecase {
  constructor(
    private readonly findQuestionRepository: FindQuestionRepository,
    private readonly removeQuestionRepository: RemoveQuestionRepository,
    private readonly jwt: JwtService,
  ) {}

  async remove(id: number, token: string): Promise<Question> {
    const userId = decodeToken(token, this.jwt);

    const question = await this.findQuestionRepository.findOneQuestion(id);

    if (!question) throw new NotFoundException('Pergunta não encontrada!');

    if (question.user_id !== userId)
      throw new UnauthorizedException(
        'Você só pode apagar suas próprias perguntas.',
      );

    if (question.answers.length > 0) {
      const answersDeleted = await this.removeQuestionRepository.deleteAnswers(
        question.answers,
      );

      if (!answersDeleted)
        throw new InternalServerErrorException('Erro no processo de exclusão!');
    }

    const questionDeleted =
      await this.removeQuestionRepository.deleteQuestion(id);

    if (!questionDeleted)
      throw new InternalServerErrorException('Erro no processo de exclusão!');

    return question;
  }
}
