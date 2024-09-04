import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserAuthInput } from './dto/create-user-auth.input';
import { LoginInput } from './dto/login.input';
import { UserAuth } from './entities/user-auth.entity';
import { UserJwtOutput } from './output/user-jwt.output';
import { UserAuthService } from './user-auth.service';

@Resolver(() => UserAuth)
export class UserAuthResolver {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Mutation(() => UserAuth)
  async createUserAuth(
    @Args('createUserAuthInput') createUserAuthInput: CreateUserAuthInput,
  ) {
    return await this.userAuthService.create(createUserAuthInput);
  }

  @Query(() => UserJwtOutput)
  async login(@Args('login', { type: () => LoginInput }) login: LoginInput) {
    return await this.userAuthService.login(login);
  }
}
