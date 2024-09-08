import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FindAnswerRepository } from './../../repositories/find-answer.repository';
import { RemoveAnswerRepository } from './../../repositories/remove-answer.repository';

@Injectable()
export class RemoveAnswerUsecase {
  constructor(
    private readonly findAnswerRepository: FindAnswerRepository,
    private readonly removeAnswerRepository: RemoveAnswerRepository,
    private readonly jwt: JwtService,
  ) {}

  async removeAnswer(id: number, token: string) {
    const userId = this.decodeToken(token);

    const answer = await this.findAnswerRepository.findOne(id);

    if (!answer) throw new NotFoundException('Resposta não encontrada!');

    if (answer.user_id !== userId)
      throw new BadRequestException(
        'Uma resposta só pode ser apagada pelo seu autor.',
      );

    await this.removeAnswerRepository.remove(id);

    return answer;
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
