import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateQuestionInput } from './create-question.input';

@InputType()
export class UpdateQuestionInput extends CreateQuestionInput {
  @Field(() => Int)
  id: number;
}
