import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateQuestionInput } from '../dto/update-question.input';
import { Question } from '../entities/question.entity';

@Injectable()
export class UpdateQuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async updateQuestion(
    updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question | false> {
    try {
      const questionUpdated =
        await this.questionRepository.save(updateQuestionInput);

      if (questionUpdated) return questionUpdated;

      return false;
    } catch (error) {
      return false;
    }
  }
}
