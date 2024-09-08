import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { SearchInput } from '../dto/search.input';
import { Question } from '../entities/question.entity';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class FindQuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findTags(): Promise<Tag[] | false> {
    try {
      const tags = await this.tagRepository.find({
        order: { tag_name: 'asc' },
      });

      if (tags) return tags;

      return false;
    } catch (error) {
      false;
    }
  }

  async findOneTag(tagName: string): Promise<Tag | false> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { tag_name: tagName },
      });

      if (tag) return tag;

      return false;
    } catch (error) {
      false;
    }
  }

  async findOneQuestion(id: number): Promise<Question | false> {
    try {
      const question = await this.questionRepository
        .createQueryBuilder('question')
        .leftJoinAndSelect('question.user', 'user')
        .leftJoinAndSelect('question.tags', 'tags')
        .leftJoinAndSelect('question.answers', 'answers')
        .leftJoinAndSelect('answers.user', 'answerUser')
        .where('question.id = :id', { id })
        .getOne();

      if (question) return question;

      return false;
    } catch (error) {
      return false;
    }
  }

  async findAllQuestions(): Promise<Question[] | false> {
    try {
      const questions = await this.questionRepository.find({
        relations: ['tags', 'user', 'answers'],
        order: { creation_date: 'DESC' },
      });

      if (questions) return questions;

      return false;
    } catch (error) {
      return false;
    }
  }

  async findAllFilteredByTags(
    searchInput: SearchInput,
  ): Promise<Question[] | false> {
    try {
      const queryBuilder = await this.questionRepository
        .createQueryBuilder('question')
        .leftJoinAndSelect('question.tags', 'tag')
        .leftJoinAndSelect('question.user', 'user')
        .leftJoinAndSelect('question.answers', 'answers')
        .orderBy('question.creationDate', 'DESC')
        .innerJoinAndSelect('question.tags', 'tags')
        .andWhere('tag.id IN (:...tagIds)', {
          tagIds: searchInput.filter_tag_ids,
        });

      const questions = await queryBuilder.getMany();

      if (questions) return questions;

      return false;
    } catch (error) {}
    return false;
  }

  async findAllByUser(userId: number): Promise<Question[] | false> {
    try {
      const questions = await this.questionRepository.find({
        relations: ['tags', 'user', 'answers'],
        order: { creation_date: 'DESC' },
        where: { user_id: userId },
      });

      if (questions) return questions;

      return false;
    } catch (error) {}
    return false;
  }

  async checkIfExist(
    title: string,
    userId: number,
    questionId?: number,
  ): Promise<boolean> {
    try {
      const queryConditions: any = {
        title: title,
        user_id: userId,
      };
      if (questionId) queryConditions.id = Not(questionId);

      const question = await this.questionRepository.findOneBy(queryConditions);

      return !!question;
    } catch (error) {}
    return false;
  }
}
