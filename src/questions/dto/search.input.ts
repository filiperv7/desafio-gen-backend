import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class SearchInput {
  @IsOptional()
  @IsArray()
  @Field(() => [Int], { nullable: 'itemsAndList' })
  filter_tag_ids?: number[];

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  only_mine?: boolean;
}
