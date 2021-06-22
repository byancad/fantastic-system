import { Repository, EntityRepository } from 'typeorm';
import { Token } from './token.entity';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  async createToken(
    userId: string,
    itemId: string,
    accessToken: string,
  ): Promise<void> {
    const newToken = new Token();
    newToken.userId = userId;
    newToken.accessToken = accessToken;
    newToken.itemId = itemId;
    await newToken.save();
  }
}
