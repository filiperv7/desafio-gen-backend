import { JwtService } from '@nestjs/jwt';
import { Question } from '../../entities/question.entity';
import { FindQuestionRepository } from '../../repositories/find-question.repository';
import { FindAllQuestionsUsecase } from './find-all-questions.usecase';

describe('FindAllQuestionsUsecase', () => {
  let usecase: FindAllQuestionsUsecase;
  let repository: FindQuestionRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    repository = new FindQuestionRepository(null, null);
    jwtService = new JwtService();
    usecase = new FindAllQuestionsUsecase(repository, jwtService);
  });

  it('should return all questions when searchInput is undefined', async () => {
    const questions = [{ id: 1, title: 'Test Question' } as Question];
    jest.spyOn(repository, 'findAllQuestions').mockResolvedValue(questions);

    const result = await usecase.findAll('');

    expect(result).toEqual(questions);
  });

  it('should return questions filtered by tags', async () => {
    const searchInput = { filter_tag_ids: [1], only_mine: undefined };
    const questions = [{ id: 1, title: 'Filtered Question' } as Question];
    jest
      .spyOn(repository, 'findAllFilteredByTags')
      .mockResolvedValue(questions);

    const result = await usecase.findAll('', searchInput);

    expect(result).toEqual(questions);
  });

  it('should return user-specific questions when only_mine is true', async () => {
    const token = 'Bearer someToken';
    const userId = 1;
    const searchInput = { filter_tag_ids: [], only_mine: true };
    const questions = [{ id: 1, title: 'My Question' } as Question];
    jest.spyOn(jwtService, 'decode').mockReturnValue({ id: userId });
    jest.spyOn(repository, 'findAllByUser').mockResolvedValue(questions);

    const result = await usecase.findAll(token, searchInput);

    expect(result).toEqual(questions);
  });
});
