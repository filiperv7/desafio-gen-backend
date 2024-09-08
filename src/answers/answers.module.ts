import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerRepository } from './repositories/create-answer.repository';
import { FindAnswerRepository } from './repositories/find-answer.repository';
import { RemoveAnswerRepository } from './repositories/remove-answer.repository';
import { CreateAnswerUsecase } from './use-case/create/create-answer.usecase';
import { RemoveAnswerUsecase } from './use-case/remove/remove-answer.usecase';

@Module({
  providers: [
    AnswersResolver,
    AnswersService,
    JwtService,
    JwtAuthGuard,
    CreateAnswerUsecase,
    RemoveAnswerUsecase,
    CreateAnswerRepository,
    FindAnswerRepository,
    RemoveAnswerRepository,
  ],
  imports: [TypeOrmModule.forFeature([Answer]), JwtModule],
})
export class AnswersModule {}
