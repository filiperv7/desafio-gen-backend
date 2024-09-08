import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class CreateTagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(tagName: string): Promise<Tag | false> {
    try {
      const tagCreated = await this.tagRepository.save({
        tag_name: tagName,
      });

      return tagCreated;
    } catch (error) {
      return false;
    }
  }
}
