import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthGuard } from '@nestjs/passport';
import {
  LinkTokenResponseDto,
  AccessTokenRequestDto,
  Account,
  Transaction,
} from './token.dto';

@Controller('token')
@UseGuards(AuthGuard())
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post('/link-token')
  @HttpCode(200)
  createLinkToken(@Req() req): Promise<LinkTokenResponseDto> {
    return this.tokenService.createLinkToken(req.user);
  }

  @Post('/access-token')
  @HttpCode(200)
  exchangeLinkTokenForAccessToken(
    @Req() req,
    @Body() body: AccessTokenRequestDto,
  ): Promise<void> {
    const { publicToken } = body;
    return this.tokenService.createAccessToken(req.user, publicToken);
  }

  @Get('/accounts')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  getItems(@Req() req): Promise<Account[]> {
    return this.tokenService.getPlaidAccounts(req.user.id);
  }

  @Get('/transactions')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  getTransactions(@Req() req): Promise<any> {
    return this.tokenService.getPlaidTransactions(req.user.id);
  }
}
