import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@ObjectType()
@Entity({ name: 'users' })
export class UserAuth {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column({ name: 'nickName' })
  nick_name: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column()
  position: string;

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];
}
