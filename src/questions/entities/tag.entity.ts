import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@ObjectType()
@Entity({ name: 'tags' })
export class Tag {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: 'tagName' })
  tag_name: string;

  @Field(() => [Question])
  @ManyToMany(() => Question, (question) => question.tags)
  questions: Question[];
}
