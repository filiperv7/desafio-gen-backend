import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { AnswersService } from './answers.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { Answer } from './entities/answer.entity';

@Resolver(() => Answer)
export class AnswersResolver {
  constructor(private readonly answersService: AnswersService) {}

  @Mutation(() => Answer)
  createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization;

    return this.answersService.create(createAnswerInput, token);
  }

  @Mutation(() => Answer)
  removeAnswer(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any,
  ) {
    const token = context.req.headers.authorization;

    return this.answersService.remove(id, token);
  }
}
