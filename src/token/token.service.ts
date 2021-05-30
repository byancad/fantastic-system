import { Injectable } from '@nestjs/common';
import e from 'express';
import { User } from 'src/users/users.entity';
import { plaidClient } from '../appConfigs/plaidConfig';

@Injectable()
export class TokenService {
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

  async createAccessToken(user: User, publicToken: string): Promise<any> {
    try {
      const response = await plaidClient.exchangePublicToken(publicToken);
      return response;
    } catch (e) {
      return e;
    }
  }
}
