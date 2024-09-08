import { JwtService } from '@nestjs/jwt';

export const decodeToken = (token: string, jwt: JwtService): number => {
  const tokenCleaned = token.split(' ')[1];
  if (tokenCleaned) {
    const decode = jwt.decode(tokenCleaned, { complete: false });
    return decode?.['id'];
  }
  return null;
};
