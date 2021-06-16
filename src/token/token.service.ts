import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { plaidClient } from '../appConfigs/plaidConfig';
import { TokenRepository } from './token.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { formattedDateNow, formattedDateOneWeekAgo } from 'src/utils/date';
import { Token } from './token.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenRepository)
    private tokenRepository: TokenRepository,
  ) {}

  async createLinkToken(user: User): Promise<any> {
    const { id } = user;
    const configs = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: id,
      },
      client_name: 'User Name',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    };

    try {
      const response = plaidClient.createLinkToken(configs);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  async createAccessToken(user: User, publicToken: string): Promise<void> {
    try {
      const response = await plaidClient.exchangePublicToken(publicToken);

      const salt = await bcrypt.genSalt();
      const encryptedToken = await this.hashToken(response.access_token, salt);

      await this.tokenRepository.delete({
        itemId: response.item_id,
        userId: user.id,
      });

      this.tokenRepository.createToken(
        user.id,
        response.item_id,
        encryptedToken,
        salt,
      );
    } catch (e) {
      return e;
    }
  }

  async getPlaidItems(userId: string): Promise<any> {
    try {
      const tokens = await this.tokenRepository.getTokensByUser(userId);

      let items = [];
      for (const token of tokens) {
        const itemResponse = await plaidClient.getItem(token.accessToken);
        items.push(itemResponse);
      }
      return items;
    } catch (e) {
      return e;
    }
  }

  private async hashToken(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
