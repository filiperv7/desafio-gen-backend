import { Injectable } from '@nestjs/common';
import { CreateUserAuthInput } from './dto/create-user-auth.input';
import { LoginInput } from './dto/login.input';
import { UserAuth } from './entities/user-auth.entity';
import { UserJwtOutput } from './output/user-jwt.output';
import { CreateUserUsecase } from './use-cases/create/create-user.usecase';
import { LoginUsecase } from './use-cases/login/login.usecase';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly loginUsecase: LoginUsecase,
  ) {}

  async create(createUserAuthInput: CreateUserAuthInput): Promise<UserAuth> {
    return await this.createUserUsecase.create(createUserAuthInput);
  }

  async login(loginInput: LoginInput): Promise<UserJwtOutput> {
    return await this.loginUsecase.login(loginInput);
  }
}
