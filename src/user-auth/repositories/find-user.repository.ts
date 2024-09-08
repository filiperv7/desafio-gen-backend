import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuth } from '../entities/user-auth.entity';

@Injectable()
export class FindUserRepository {
  constructor(
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
  ) {}

  async findOne(nickName: string): Promise<UserAuth | false> {
    try {
      const userAlreadyExists = await this.userAuthRepository.findOneBy({
        nick_name: nickName,
      });

      if (userAlreadyExists) return userAlreadyExists;

      return false;
    } catch (error) {
      return false;
    }
  }
}
