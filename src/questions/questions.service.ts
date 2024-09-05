import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionInput } from './dto/create-question.input';
import { SearchInput } from './dto/search.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private readonly jwt: JwtService,
  ) {}

  async create(
    createQuestionInput: CreateQuestionInput,
    token: string,
  ): Promise<Question> {
    const userId = this.decodeToken(token);

    const alreadyExist = await this.questionRepository.findOneBy({
      title: createQuestionInput.title,
      userId: userId,
    });

    if (alreadyExist === null) {
      const tags = await Promise.all(
        createQuestionInput.tags.map(async (tagInput) => {
          let tag = tagInput;

          if (!tagInput.id) {
            tag = await this.tagRepository.findOne({
              where: { tag_name: tagInput.tag_name },
            });
            if (!tag) {
              tag = await this.tagRepository.save({
                tag_name: tagInput.tag_name,
              });
            }
          }

          return tag;
        }),
      );

      const questionCreated = await this.questionRepository.save({
        ...createQuestionInput,
        userId: userId,
        tags: tags,
      });

      return questionCreated;
    }

    throw new ConflictException('Você já fez esta pergunta');
  }

  async findAll(token: string, searchInput?: SearchInput): Promise<Question[]> {
    let questions: Question[];

    if (searchInput !== undefined) {
      if (searchInput.filter_tag_ids && searchInput.filter_tag_ids.length > 0) {
        const queryBuilder = this.questionRepository
          .createQueryBuilder('question')
          .leftJoinAndSelect('question.tags', 'tag')
          .leftJoinAndSelect('question.user', 'user')
          .orderBy('question.creation_date', 'DESC')
          .innerJoinAndSelect('question.tags', 'tags')
          .andWhere('tag.id IN (:...tagIds)', {
            tagIds: searchInput.filter_tag_ids,
          });

        questions = await queryBuilder.getMany();
        return questions;
      }

      if (searchInput.only_mine === true) {
        const userId = this.decodeToken(token);

        questions = await this.questionRepository.find({
          relations: ['tags', 'user'],
          order: { creation_date: 'DESC' },
          where: { userId },
        });

        return questions;
      }
    }

    if (searchInput === undefined) {
      questions = await this.questionRepository.find({
        relations: ['tags', 'user'],
        order: { creation_date: 'DESC' },
      });

      return questions;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionInput: UpdateQuestionInput) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }

  private decodeToken(token: string): number {
    const tokenCleaned = token.split(' ')[1];
    if (tokenCleaned) {
      const decode = this.jwt.decode(tokenCleaned, { complete: false });

      return decode.id;
    }

    return null;
  }
}
