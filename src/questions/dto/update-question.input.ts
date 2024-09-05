import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray } from 'class-validator';
import { CreateQuestionInput } from './create-question.input';
import { UpdateTagInput } from './update-tag.input';

@InputType()
export class UpdateQuestionInput extends CreateQuestionInput {
  @Field(() => Int)
  id: number;

  @IsArray()
  @ArrayMaxSize(3)
  @Type(() => UpdateTagInput)
  @Field(() => [UpdateTagInput], { nullable: 'itemsAndList' })
  tags: UpdateTagInput[];
}
