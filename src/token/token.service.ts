import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import * as plaid from 'plaid';

@Injectable()
export class TokenService {
  async createLinkToken(user: User): Promise<any> {
    const plaidClient = new plaid.Client({
      clientID: '60914bfb83a476001144830d',
      secret: 'ebf23fa94386dbc8307d372722256f',
      env: plaid.environments.development,
      options: {
        version: '2020-09-14',
      },
    });

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
      // redirect_uri: 'http://localhost:3000',
    };

    try {
      const response = plaidClient.createLinkToken(configs);
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
