import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../../answers/entities/answer.entity';
import { Question } from '../entities/question.entity';

@Injectable()
export class RemoveQuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async deleteAnswers(answers: Answer[]): Promise<boolean> {
    try {
      await Promise.all(
        answers.map(async (answer) => {
          await this.answerRepository.delete(answer.id);
        }),
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteQuestion(id: number): Promise<boolean> {
    try {
      await this.questionRepository.delete(id);

      return true;
    } catch (error) {
      return false;
    }
  }
}
