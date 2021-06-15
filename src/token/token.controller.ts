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
import { LinkTokenResponseDto, AccessTokenRequestDto } from './token.dto';

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

  @Get('/items')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  getItems(@Req() req): Promise<any> {
    return this.tokenService.getPlaidItems(req.user.id);
  }
}
