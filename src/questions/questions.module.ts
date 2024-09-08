import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../answers/entities/answer.entity';
import { Question } from './entities/question.entity';
import { Tag } from './entities/tag.entity';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';
import { CreateQuestionRepository } from './repositories/create-question.repository';
import { CreateTagRepository } from './repositories/create-tag.repository';
import { FindQuestionRepository } from './repositories/find-question.repository';
import { RemoveQuestionRepository } from './repositories/remove-question.repository';
import { UpdateQuestionRepository } from './repositories/update-question.repository';
import { CreateQuestionUsecase } from './use-case/create/create-question.usecase';
import { FindAllQuestionsUsecase } from './use-case/find-all/find-all-questions.usecase';
import { FindOneQuestionUsecase } from './use-case/find-one/find-one-question.usecase';
import { FindTagsUsecase } from './use-case/find-tags/find-tags.usecase';
import { RemoveQuestionUsecase } from './use-case/remove/remove-question.usecase';
import { UpdateQuestionUsecase } from './use-case/update/update-question.usecase';

@Module({
  providers: [
    QuestionsResolver,
    QuestionsService,
    JwtService,
    FindTagsUsecase,
    FindOneQuestionUsecase,
    FindAllQuestionsUsecase,
    FindQuestionRepository,
    RemoveQuestionUsecase,
    RemoveQuestionRepository,
    CreateQuestionRepository,
    CreateQuestionUsecase,
    UpdateQuestionUsecase,
    UpdateQuestionRepository,
    CreateTagRepository,
  ],
  imports: [TypeOrmModule.forFeature([Question, Tag, Answer]), JwtModule],
})
export class QuestionsModule {}
