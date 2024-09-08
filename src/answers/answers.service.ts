import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerInput } from './dto/create-answer.input';
import { Answer } from './entities/answer.entity';
import { CreateAnswerUsecase } from './use-case/create/create-answer.usecase';
import { RemoveAnswerUsecase } from './use-case/remove/remove-answer.usecase';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    private readonly createAnswerUsecase: CreateAnswerUsecase,
    private readonly removeAnswerUsecase: RemoveAnswerUsecase,
    private readonly jwt: JwtService,
  ) {}

  async create(createAnswerInput: CreateAnswerInput, token: string) {
    return await this.createAnswerUsecase.create(createAnswerInput, token);
  }

  async remove(id: number, token: string) {
    return await this.removeAnswerUsecase.removeAnswer(id, token);
  }
}
