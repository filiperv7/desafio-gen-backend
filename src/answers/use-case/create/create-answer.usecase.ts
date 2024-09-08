import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    const userId = this.decodeToken(token);

    const answerCreated = await this.createAnswerRepository.create(
      createAnswerInput,
      userId,
    );

    if (answerCreated) return answerCreated;

    throw new InternalServerErrorException('Erro ao criar resposta!');
  }

  private decodeToken(token: string): number {
    const tokenCleaned = token.split(' ')[1];
    if (tokenCleaned) {
      const decode = this.jwt.decode(tokenCleaned, { complete: false });

      return decode.id;
    }

    return null;
  }
}
