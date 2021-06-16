import { Repository, EntityRepository } from 'typeorm';
import { Token } from './token.entity';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  async createToken(
    userId: string,
    itemId: string,
    accessToken: string,
    salt: string,
  ): Promise<void> {
    const newToken = new Token();
    newToken.userId = userId;
    newToken.accessToken = accessToken;
    newToken.itemId = itemId;
    newToken.salt = salt;
    await newToken.save();
  }

  async getTokensByUser(userId: string): Promise<Token[]> {
    const query = this.createQueryBuilder('token');
    query.select(['token.id', 'token.access_token', 'token.salt']);
    query.andWhere('user_id = :userId', { userId });
    return await query.getMany();
  }
}
