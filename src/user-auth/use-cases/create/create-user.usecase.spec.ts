import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserAuthInput } from '../../dto/create-user-auth.input';
import { UserAuth } from '../../entities/user-auth.entity';
import { CreateUserRepository } from '../../repositories/create-user.repository';
import { FindUserRepository } from '../../repositories/find-user.repository';
import { CreateUserUsecase } from './create-user.usecase';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedpassword'),
}));

describe('CreateUserUsecase', () => {
  let usecase: CreateUserUsecase;
  let findUserRepository: FindUserRepository;
  let createUserRepository: CreateUserRepository;

  beforeEach(async () => {
    findUserRepository = new FindUserRepository(null);
    createUserRepository = new CreateUserRepository(null);
    usecase = new CreateUserUsecase(findUserRepository, createUserRepository);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserAuthInput: CreateUserAuthInput = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        nick_name: 'johndoe',
        password: 'securepassword',
        position: 'developer',
      };

      jest.spyOn(findUserRepository, 'findOne').mockResolvedValue(false);
      jest.spyOn(createUserRepository, 'create').mockResolvedValue({
        ...createUserAuthInput,
        id: 1,
        password: 'hashedpassword',
      } as UserAuth);

      const result = await usecase.create(createUserAuthInput);

      expect(result).toEqual({
        id: 1,
        ...createUserAuthInput,
        password: 'hashedpassword',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserAuthInput: CreateUserAuthInput = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        nick_name: 'johndoe',
        password: 'securepassword',
        position: 'developer',
      };

      jest.spyOn(findUserRepository, 'findOne').mockResolvedValue({
        ...createUserAuthInput,
        id: 1,
      } as UserAuth);

      await expect(usecase.create(createUserAuthInput)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException on error during user creation', async () => {
      const createUserAuthInput: CreateUserAuthInput = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        nick_name: 'johndoe',
        password: 'securepassword',
        position: 'developer',
      };

      jest.spyOn(findUserRepository, 'findOne').mockResolvedValue(false);
      jest.spyOn(createUserRepository, 'create').mockResolvedValue(false);

      await expect(usecase.create(createUserAuthInput)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
