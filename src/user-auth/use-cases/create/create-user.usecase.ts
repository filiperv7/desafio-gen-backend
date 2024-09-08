import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserAuthInput } from '../../dto/create-user-auth.input';
import { UserAuth } from '../../entities/user-auth.entity';
import { CreateUserRepository } from '../../repositories/create-user.repository';
import { FindUserRepository } from '../../repositories/find-user.repository';

@Injectable()
export class CreateUserUsecase {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async create(createUserAuthInput: CreateUserAuthInput): Promise<UserAuth> {
    const userAlreadyExists = await this.findUserRepository.findOne(
      createUserAuthInput.nick_name,
    );

    if (userAlreadyExists) {
      throw new ConflictException(
        'Já existe um usuário com este apelido, tente outro.',
      );
    }

    const { password } = createUserAuthInput;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = await this.createUserRepository.create({
      ...createUserAuthInput,
      password: hashedPassword,
    });

    if (userCreated) return userCreated;

    throw new InternalServerErrorException();
  }
}
