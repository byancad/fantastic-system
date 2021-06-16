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
