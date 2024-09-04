import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

export type TokenJwt = {
  token: string;
  expireIn: string;
};

export type DataForToken = {
  id: number;
  name: string;
  email: string;
  nick_name: string;
  position: string;
};

export class LoginAuthJwt extends JwtService {
  async generateJwtToken(data: DataForToken): Promise<TokenJwt | false> {
    try {
      const options = {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h',
      };

      const token = await this.signAsync(data, options);

      if (token) return { token, expireIn: options.expiresIn };
    } catch (error) {
      return false;
    }
  }
}
