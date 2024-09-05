import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from '../../answers/entities/answer.entity';
import { UserAuth } from '../../user-auth/entities/user-auth.entity';
import { Tag } from './tag.entity';

@ObjectType()
@Entity({ name: 'questions' })
export class Question {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @CreateDateColumn({ name: 'creationDate' })
  creation_date: Date;

  @Field(() => [Tag])
  @ManyToMany(() => Tag, (tag) => tag.questions, { cascade: true })
  @JoinTable({
    name: 'questions_tags',
    joinColumn: { name: 'questionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @Field(() => UserAuth)
  @ManyToOne(() => UserAuth, (user) => user.questions)
  user: UserAuth;

  @Field(() => Int)
  @Column({ name: 'userId' })
  user_id: number;

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
