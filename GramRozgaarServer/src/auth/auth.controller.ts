// auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthServices } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authServices: AuthServices) { }

    @Post('refresh')
    async refreshTokens(@Body() dto: RefreshDto) {
        const user = await this.authServices.validateRefreshToken(dto.userId, dto.refreshToken);
        const tokens = await this.authServices.getTokens(user.id, user.phoneNumber);
        await this.authServices.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

}
