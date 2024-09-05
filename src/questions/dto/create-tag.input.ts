import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateTagInput {
  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Field()
  tag_name: string;
}
