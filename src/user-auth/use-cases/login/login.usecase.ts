import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  DataForToken,
  LoginAuthJwt,
  TokenJwt,
} from '../../../utils/login-auth-jwt.util';
import { UserJwtOutput } from '../../output/user-jwt.output';
import { FindUserRepository } from '../../repositories/find-user.repository';
import { LoginInput } from './../../dto/login.input';

@Injectable()
export class LoginUsecase {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly loginAuthJwt: LoginAuthJwt,
  ) {}

  async login(loginInput: LoginInput): Promise<UserJwtOutput> {
    const userFounded = await this.findUserRepository.findOne(
      loginInput.nick_name,
    );

    if (
      userFounded &&
      (await bcrypt.compare(loginInput.password, userFounded.password))
    ) {
      const dataForToken: DataForToken = {
        id: userFounded.id,
        name: userFounded.name,
        email: userFounded.email,
        nick_name: userFounded.nick_name,
        position: userFounded.position,
      };

      const token: TokenJwt | false =
        await this.loginAuthJwt.generateJwtToken(dataForToken);

      if (token) {
        return {
          access_token: token.token,
          expires_in: token.expireIn,
          token_type: 'bearer',
        };
      }
    }

    throw new UnauthorizedException('Credenciais inválidas!');
  }
}
