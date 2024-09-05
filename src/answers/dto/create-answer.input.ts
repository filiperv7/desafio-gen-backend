import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateAnswerInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Field()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  question_id: number;
}
