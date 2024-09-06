import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerInput } from './dto/create-answer.input';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    private readonly jwt: JwtService,
  ) {}

  async create(createAnswerInput: CreateAnswerInput, token: string) {
    const userId = this.decodeToken(token);

    return await this.answerRepository.save({
      ...createAnswerInput,
      user_id: userId,
    });
  }

  async remove(id: number, token: string) {
    const userId = this.decodeToken(token);

    const answer = await this.answerRepository.findOneBy({
      id,
    });

    if (!answer) throw new NotFoundException('Resposta não encontrada!');

    if (answer.user_id !== userId)
      throw new BadRequestException(
        'Uma resposta só pode ser apagada pelo seu autor.',
      );

    await this.answerRepository.delete(id);

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
