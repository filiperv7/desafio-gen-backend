import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../answers/entities/answer.entity';
import { Question } from './entities/question.entity';
import { Tag } from './entities/tag.entity';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';

@Module({
  providers: [QuestionsResolver, QuestionsService, JwtService],
  imports: [TypeOrmModule.forFeature([Question, Tag, Answer])],
})
export class QuestionsModule {}
