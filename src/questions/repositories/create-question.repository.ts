import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionInput } from '../dto/create-question.input';
import { Question } from '../entities/question.entity';

@Injectable()
export class CreateQuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createQuestion(
    createQuestionInput: CreateQuestionInput,
  ): Promise<Question | false> {
    try {
      const questionCreated =
        await this.questionRepository.save(createQuestionInput);

      if (questionCreated) return questionCreated;

      return false;
    } catch (error) {
      return false;
    }
  }
}
