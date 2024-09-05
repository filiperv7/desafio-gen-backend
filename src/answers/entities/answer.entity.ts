import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../questions/entities/question.entity';
import { UserAuth } from '../../user-auth/entities/user-auth.entity';

@ObjectType()
@Entity({ name: 'answers' })
export class Answer {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  content: string;

  @Field()
  @CreateDateColumn({ name: 'creationDate' })
  creation_date: Date;

  @Field(() => UserAuth)
  @ManyToOne(() => UserAuth, (user) => user.answers)
  user: UserAuth;

  @Field(() => Int)
  @Column({ name: 'userId' })
  user_id: number;

  @Field(() => Question)
  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @Field(() => Int)
  @Column({ name: 'questionId' })
  question_id: number;
}
