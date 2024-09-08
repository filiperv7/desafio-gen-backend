import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { CreateQuestionInput } from './dto/create-question.input';
import { SearchInput } from './dto/search.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';
import { Tag } from './entities/tag.entity';
import { QuestionsService } from './questions.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => Question)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Mutation(() => Question)
  createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
    @Context() context: { req: Request },
  ) {
    const token = context.req.headers.authorization;

    return this.questionsService.create(createQuestionInput, token);
  }

  @Query(() => [Question], { name: 'questions' })
  findAll(
    @Context() context: { req: Request },
    @Args('searchInput', { nullable: true }) searchInput?: SearchInput,
  ) {
    const token = context.req.headers.authorization;

    return this.questionsService.findAll(token, searchInput);
  }

  @Query(() => Question, { name: 'question' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.questionsService.findOne(id);
  }

  @Query(() => [Tag], { name: 'tags' })
  findAllTags() {
    return this.questionsService.findAllTags();
  }

  @Mutation(() => Question)
  updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
    @Context() context: { req: Request },
  ) {
    const token = context.req.headers.authorization;

    return this.questionsService.update(
      updateQuestionInput.id,
      updateQuestionInput,
      token,
    );
  }

  @Mutation(() => Question)
  removeQuestion(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: { req: Request },
  ) {
    const token = context.req.headers.authorization;

    return this.questionsService.remove(id, token);
  }
}
