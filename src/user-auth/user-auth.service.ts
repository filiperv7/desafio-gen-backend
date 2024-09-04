import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  DataForToken,
  LoginAuthJwt,
  TokenJwt,
} from '../utils/login-auth-jwt.util';
import { CreateUserAuthInput } from './dto/create-user-auth.input';
import { LoginInput } from './dto/login.input';
import { UserAuth } from './entities/user-auth.entity';
import { UserJwtOutput } from './output/user-jwt.output';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
    private readonly loginAuthJwt: LoginAuthJwt,
  ) {}

  async create(createUserAuthInput: CreateUserAuthInput): Promise<UserAuth> {
    const userAlreadyExists = await this.userAuthRepository.findOneBy({
      nick_name: createUserAuthInput.nick_name,
    });

    if (userAlreadyExists) {
      throw new ConflictException(
        'Já existe um usuário com este apelido, tente outro.',
      );
    }

    const { password, ...rest } = createUserAuthInput;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.userAuthRepository.save({
      ...rest,
      password: hashedPassword,
    });
  }

  async login(loginInput: LoginInput): Promise<UserJwtOutput | null> {
    const userFounded = await this.userAuthRepository.findOneBy({
      nick_name: loginInput.nick_name,
    });

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
