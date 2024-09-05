import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';

@Module({
  providers: [AnswersResolver, AnswersService, JwtService],
  imports: [TypeOrmModule.forFeature([Answer])],
})
export class AnswersModule {}
