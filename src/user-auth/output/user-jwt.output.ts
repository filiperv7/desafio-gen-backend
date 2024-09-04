import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserJwtOutput {
  @Field()
  access_token: string;

  @Field()
  token_type: string;

  @Field()
  expires_in: string;
}
