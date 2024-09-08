import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AnswersService } from './answers.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { Answer } from './entities/answer.entity';

@UseGuards(JwtAuthGuard)
@Resolver(() => Answer)
export class AnswersResolver {
  constructor(private readonly answersService: AnswersService) {}

  @Mutation(() => Answer)
  createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
    @Context() context: { req: Request },
  ) {
    const token = context.req.headers.authorization;

    return this.answersService.create(createAnswerInput, token);
  }

  @Mutation(() => Answer)
  removeAnswer(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: { req: Request },
  ) {
    const token = context.req.headers.authorization;

    return this.answersService.remove(id, token);
  }
}
