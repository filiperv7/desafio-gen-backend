import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginAuthJwt } from '../utils/login-auth-jwt.util';
import { UserAuth } from './entities/user-auth.entity';
import { UserAuthResolver } from './user-auth.resolver';
import { UserAuthService } from './user-auth.service';

@Module({
  providers: [UserAuthResolver, UserAuthService, LoginAuthJwt],
  imports: [TypeOrmModule.forFeature([UserAuth])],
})
export class UserAuthModule {}
