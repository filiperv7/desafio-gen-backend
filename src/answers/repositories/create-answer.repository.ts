import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerInput } from '../dto/create-answer.input';
import { Answer } from '../entities/answer.entity';

@Injectable()
export class CreateAnswerRepository {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async create(
    createAnswerInput: CreateAnswerInput,
    userId: number,
  ): Promise<Answer | false> {
    try {
      const answerCreated = await this.answerRepository.save({
        ...createAnswerInput,
        user_id: userId,
      });

      if (answerCreated) return answerCreated;

      return false;
    } catch (error) {
      false;
    }
  }
}
