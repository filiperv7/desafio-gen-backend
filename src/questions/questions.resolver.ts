import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateQuestionInput } from './dto/create-question.input';
import { SearchInput } from './dto/search.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';
import { QuestionsService } from './questions.service';

@Resolver(() => Question)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Mutation(() => Question)
  createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization;

    return this.questionsService.create(createQuestionInput, token);
  }

  @Query(() => [Question], { name: 'questions' })
  findAll(
    @Context() context: any,
    @Args('searchInput', { nullable: true }) searchInput?: SearchInput,
  ) {
    const token = context.req.headers.authorization;

    return this.questionsService.findAll(token, searchInput);
  }

  @Query(() => Question, { name: 'question' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.questionsService.findOne(id);
  }

  @Mutation(() => Question)
  updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ) {
    return this.questionsService.update(
      updateQuestionInput.id,
      updateQuestionInput,
    );
  }

  @Mutation(() => Question)
  removeQuestion(@Args('id', { type: () => Int }) id: number) {
    return this.questionsService.remove(id);
  }
}
