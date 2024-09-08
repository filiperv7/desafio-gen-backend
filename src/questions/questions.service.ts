import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../answers/entities/answer.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { SearchInput } from './dto/search.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';
import { Tag } from './entities/tag.entity';
import { CreateQuestionUsecase } from './use-case/create/create-question.usecase';
import { FindAllQuestionsUsecase } from './use-case/find-all/find-all-questions.usecase';
import { FindOneQuestionUsecase } from './use-case/find-one/find-one-question.usecase';
import { FindTagsUsecase } from './use-case/find-tags/find-tags.usecase';
import { RemoveQuestionUsecase } from './use-case/remove/remove-question.usecase';
import { UpdateQuestionUsecase } from './use-case/update/update-question.usecase';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    private readonly jwt: JwtService,
    private readonly createQuestionUsecase: CreateQuestionUsecase,
    private readonly findTagsUsecase: FindTagsUsecase,
    private readonly findOneQuestionUsecase: FindOneQuestionUsecase,
    private readonly findAllQuestionsUsecase: FindAllQuestionsUsecase,
    private readonly removeQuestionUsecase: RemoveQuestionUsecase,
    private readonly updateQuestionUsecase: UpdateQuestionUsecase,
  ) {}

  async create(
    createQuestionInput: CreateQuestionInput,
    token: string,
  ): Promise<Question> {
    return await this.createQuestionUsecase.create(createQuestionInput, token);
  }

  async findAll(token: string, searchInput?: SearchInput): Promise<Question[]> {
    return await this.findAllQuestionsUsecase.findAll(token, searchInput);
  }

  async findOne(id: number): Promise<Question> {
    return await this.findOneQuestionUsecase.findOne(id);
  }

  async findAllTags(): Promise<Tag[]> {
    return await this.findTagsUsecase.findTags();
  }

  async update(
    id: number,
    updateQuestionInput: UpdateQuestionInput,
    token: string,
  ): Promise<Question> {
    return await this.updateQuestionUsecase.update(
      id,
      updateQuestionInput,
      token,
    );
  }

  async remove(id: number, token: string) {
    return await this.removeQuestionUsecase.remove(id, token);
  }
}
