import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authHeader = ctx.req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Acesso não autorizado!');
    }

    const token = authHeader.split(' ')[1];

    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token de acesso inválido ou expirado!');
    }
  }
}
