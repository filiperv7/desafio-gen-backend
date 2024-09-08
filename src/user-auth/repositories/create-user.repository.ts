import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserAuthInput } from '../dto/create-user-auth.input';
import { UserAuth } from '../entities/user-auth.entity';

@Injectable()
export class CreateUserRepository {
  constructor(
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
  ) {}

  async create(
    createUserAuthInput: CreateUserAuthInput,
  ): Promise<UserAuth | false> {
    try {
      const userCreated =
        await this.userAuthRepository.save(createUserAuthInput);

      if (userCreated) return userCreated;

      return false;
    } catch (error) {
      return false;
    }
  }
}
