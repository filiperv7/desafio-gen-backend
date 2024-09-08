import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginAuthJwt } from '../utils/login-auth-jwt.util';
import { UserAuth } from './entities/user-auth.entity';
import { CreateUserRepository } from './repositories/create-user.repository';
import { FindUserRepository } from './repositories/find-user.repository';
import { CreateUserUsecase } from './use-cases/create/create-user.usecase';
import { LoginUsecase } from './use-cases/login/login.usecase';
import { UserAuthResolver } from './user-auth.resolver';
import { UserAuthService } from './user-auth.service';

@Module({
  providers: [
    UserAuthResolver,
    UserAuthService,
    LoginAuthJwt,
    CreateUserUsecase,
    LoginUsecase,
    FindUserRepository,
    CreateUserRepository,
  ],
  imports: [TypeOrmModule.forFeature([UserAuth])],
})
export class UserAuthModule {}
