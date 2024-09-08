import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decodeToken } from '../../../utils/decode-token.util';
import { SearchInput } from '../../dto/search.input';
import { Question } from '../../entities/question.entity';
import { FindQuestionRepository } from '../../repositories/find-question.repository';

@Injectable()
export class FindAllQuestionsUsecase {
  constructor(
    private readonly findQuestionRepository: FindQuestionRepository,
    private readonly jwt: JwtService,
  ) {}

  async findAll(token: string, searchInput?: SearchInput): Promise<Question[]> {
    if (searchInput !== undefined) {
      if (searchInput.filter_tag_ids && searchInput.filter_tag_ids.length > 0) {
        const questions =
          await this.findQuestionRepository.findAllFilteredByTags(searchInput);

        if (questions) return questions;
      }

      if (searchInput.only_mine === true) {
        const userId = decodeToken(token, this.jwt);

        const questions =
          await this.findQuestionRepository.findAllByUser(userId);

        if (questions) return questions;
      }
    }

    if (searchInput === undefined) {
      const questions = await this.findQuestionRepository.findAllQuestions();

      if (questions) return questions;
    }
  }
}
