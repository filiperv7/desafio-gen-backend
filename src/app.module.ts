import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Question } from './questions/entities/question.entity';
import { Tag } from './questions/entities/tag.entity';
import { QuestionsModule } from './questions/questions.module';
import { UserAuth } from './user-auth/entities/user-auth.entity';
import { UserAuthModule } from './user-auth/user-auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), '/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sqlite.db',
      synchronize: true,
      entities: [UserAuth, Question, Tag],
    }),
    UserAuthModule,
    QuestionsModule,
  ],
})
export class AppModule {}
