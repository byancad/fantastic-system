export type LinkTokenResponseDto = {
  expiration: string;
  link_token: string;
  request_id: string;
  status_code: number;
};

export type AccessTokenResponseDto = {
  access_token: string;
  item_id: string;
  request_id?: string;
  status_code?: number;
};

export type AccessTokenRequestDto = {
  publicToken: string;
};

export type Institution = {
  id: string;
  name: string;
};

export type InstutionResponseDto = {
  institutions: Institution[];
};

export type Account = {
  id: string;
  availableBalance: number | null;
  currentBalance: number;
  limit: number | null;
  maskedName: string | null;
  name: string;
  officialName: string | null;
  subType: string;
  type: string;
  institutionId: string;
  institutionName: string;
  itemId: string;
};

export type Transaction = {
  accountId: string;
  amount: number | null;
  date: string;
  authorizedDate: string | null;
  merchantName: string | null;
  name: string | null;
  pending: boolean | null;
  transactionId: string;
  transactionType: string | null;
};

export type TransactionResponseDto = {
  [id: string]: Transaction[];
};
