import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';

@Module({
  providers: [AnswersResolver, AnswersService, JwtService, JwtAuthGuard],
  imports: [TypeOrmModule.forFeature([Answer]), JwtModule],
})
export class AnswersModule {}
