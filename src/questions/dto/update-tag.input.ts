import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateTagInput } from './create-tag.input';

@InputType()
export class UpdateTagInput extends CreateTagInput {
  @Field(() => Int)
  id: number;
}
