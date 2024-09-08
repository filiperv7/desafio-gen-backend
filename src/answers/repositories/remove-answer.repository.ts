import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../entities/answer.entity';

@Injectable()
export class RemoveAnswerRepository {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async remove(id: number): Promise<boolean> {
    try {
      await this.answerRepository.delete(id);

      return true;
    } catch (error) {
      false;
    }
  }
}
