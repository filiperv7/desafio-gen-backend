import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  nick_name: string;

  @Field()
  password: string;
}
