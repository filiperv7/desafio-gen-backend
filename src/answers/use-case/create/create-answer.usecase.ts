import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from '../../../utils/decode-token.util';
import { CreateAnswerInput } from '../../dto/create-answer.input';
import { Answer } from '../../entities/answer.entity';
import { CreateAnswerRepository } from '../../repositories/create-answer.repository';

@Injectable()
export class CreateAnswerUsecase {
  constructor(
    private readonly createAnswerRepository: CreateAnswerRepository,
    private readonly jwt: JwtService,
  ) {}

  async create(
    createAnswerInput: CreateAnswerInput,
    token: string,
  ): Promise<Answer> {
    const userId = decodeToken(token, this.jwt);

    const answerCreated = await this.createAnswerRepository.create(
      createAnswerInput,
      userId,
    );

    if (answerCreated) return answerCreated;

    throw new InternalServerErrorException('Erro ao criar resposta!');
  }
}
