import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { plaidClient } from '../appConfigs/plaidConfig';
import { TokenRepository } from './token.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { formattedDateNow, formattedDateOneWeekAgo } from 'src/utils/date';
import { Token } from './token.entity';
import { encrypt, decrypt } from '../appConfigs/encryption.config';
import {
  Institution,
  Account,
  Transaction,
  TransactionResponseDto,
} from './token.dto';

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

      const encryptedToken = encrypt(response.access_token);

      await this.tokenRepository.delete({
        itemId: response.item_id,
        userId: user.id,
      });

      this.tokenRepository.createToken(
        user.id,
        response.item_id,
        encryptedToken,
      );
    } catch (e) {
      return e;
    }
  }

  async getPlaidAccounts(userId: string): Promise<Account[]> {
    try {
      const tokens = await this.tokenRepository.find({
        select: ['accessToken', 'itemId'],
        where: { userId: userId },
      });
      let accountDtos: Account[] = [];
      for (const token of tokens) {
        const decryptedToken = decrypt(token.accessToken);
        const accountResponse = await plaidClient.getAccounts(decryptedToken);
        const itemDetail = await plaidClient.getInstitutionById(
          accountResponse.item.institution_id,
          ['US'],
        );

        for (const account of accountResponse.accounts) {
          const accountDetail: Account = {
            id: account.account_id,
            availableBalance: account.balances.available,
            currentBalance: account.balances.current,
            limit: account.balances.limit,
            officialName: account.official_name,
            name: account.name,
            maskedName: account.mask,
            subType: account.subtype,
            type: account.type,
            institutionId: itemDetail.institution.institution_id,
            institutionName: itemDetail.institution.name,
            itemId: accountResponse.item.item_id,
          };

          accountDtos.push(accountDetail);
        }
      }
      return accountDtos;
    } catch (e) {
      return e;
    }
  }

  async getPlaidTransactions(userId: string): Promise<any> {
    try {
      const tokens = await this.tokenRepository.find({
        select: ['accessToken', 'itemId'],
        where: { userId: userId },
      });
      let transactionsObject: TransactionResponseDto = {};
      let transactionDtos: Transaction[] = [];

      for (const token of tokens) {
        const decryptedToken = decrypt(token.accessToken);
        const transactionResponse = await plaidClient.getTransactions(
          decryptedToken,
          formattedDateOneWeekAgo(),
          formattedDateNow(),
        );

        for (let txn of transactionResponse.transactions) {
          const tx: Transaction = {
            accountId: txn.account_id,
            amount: txn.amount,
            date: txn.date,
            authorizedDate: txn.authorized_date,
            merchantName: txn.merchant_name,
            name: txn.name,
            pending: txn.pending,
            transactionId: txn.transaction_id,
            transactionType: txn.transaction_type,
          };

          if (transactionsObject.hasOwnProperty(tx.accountId)) {
            let array = transactionsObject[tx.accountId];
            array.push(tx);
          } else {
            let newArray = [];
            newArray.push(tx);
            transactionsObject[tx.accountId] = newArray;
          }
        }
      }

      return transactionsObject;
    } catch (e) {
      return e;
    }
  }
}
