import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('token')
@UseGuards(AuthGuard())
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post('/link-token')
  @HttpCode(200)
  createBooking(@Req() req, @Body() createLinkToken: any): Promise<void> {
    return this.tokenService.createLinkToken(req.user);
  }
}
