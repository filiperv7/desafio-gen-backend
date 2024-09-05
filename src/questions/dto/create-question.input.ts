import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateTagInput } from './create-tag.input';

@InputType()
export class CreateQuestionInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Field()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @Field()
  description: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  creation_date?: Date;

  @IsArray()
  @ArrayMaxSize(3)
  @Type(() => CreateTagInput)
  @Field(() => [CreateTagInput])
  tags: CreateTagInput[];
}
