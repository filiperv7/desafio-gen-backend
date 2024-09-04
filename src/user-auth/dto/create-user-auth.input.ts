import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserAuthInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  nick_name: string;

  @Field()
  password: string;

  @Field()
  position: string;
}
