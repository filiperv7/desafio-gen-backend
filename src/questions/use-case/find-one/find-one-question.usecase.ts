import { Injectable, NotFoundException } from '@nestjs/common';
import { Question } from '../../entities/question.entity';
import { FindQuestionRepository } from '../../repositories/find-question.repository';

@Injectable()
export class FindOneQuestionUsecase {
  constructor(
    private readonly findQuestionRepository: FindQuestionRepository,
  ) {}

  async findOne(id: number): Promise<Question> {
    const question = await this.findQuestionRepository.findOneQuestion(id);

    if (question) return question;

    throw new NotFoundException('Pergunta não encontrada!');
  }
}
