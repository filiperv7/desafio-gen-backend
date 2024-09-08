import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../entities/answer.entity';

@Injectable()
export class FindAnswerRepository {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async findOne(id: number): Promise<Answer | false> {
    try {
      const answer = await this.answerRepository.findOneBy({ id });

      if (answer) return answer;

      return false;
    } catch (error) {
      false;
    }
  }
}
