import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      user_id: userId,
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
        user_id: userId,
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
          .orderBy('question.creationDate', 'DESC')
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
          where: { user_id: userId },
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

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.user', 'user')
      .leftJoinAndSelect('question.tags', 'tags')
      .leftJoinAndSelect('question.answers', 'answers')
      .leftJoinAndSelect('answers.user', 'answerUser')
      .where('question.id = :id', { id })
      .getOne();

    if (question) return question;

    throw new NotFoundException('Pergunta não encontrada!');
  }

  async update(
    id: number,
    updateQuestionInput: UpdateQuestionInput,
    token: string,
  ): Promise<Question> {
    const userId = this.decodeToken(token);

    const question: Question = await this.questionRepository.findOne({
      where: { id },
      relations: ['answers', 'tags'],
    });

    if (!question) {
      throw new NotFoundException('Pergunta não encontrada.');
    }

    if (question.user_id !== userId) {
      throw new UnauthorizedException(
        'Você só pode editar suas próprias perguntas.',
      );
    }

    if (question.answers.length > 0) {
      throw new BadRequestException(
        'Esta pergunta já possui respostas, portanto não pode ser alterada.',
      );
    }

    const alreadyExist = await this.questionRepository.findOneBy({
      title: updateQuestionInput.title,
      description: updateQuestionInput.description,
      user_id: userId,
    });

    if (alreadyExist === null) {
      const tags = await Promise.all(
        updateQuestionInput.tags.map(async (tagInput) => {
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

      question.title = updateQuestionInput.title;
      question.description = updateQuestionInput.description;
      question.tags = tags as Tag[];

      await this.questionRepository.save(question);

      return question;
    }

    throw new ConflictException('Você já fez esta pergunta');
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
