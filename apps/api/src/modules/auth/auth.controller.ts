import { Controller, Post, Body, Ip, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public.decorator';
import { LoginDto, LoginResponseDto, RefreshTokenDto } from './auth.dto';
import { CurrentUser, CurrentUserPayload } from '../../decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin login' })
    @ApiResponse({ status: 200, type: LoginResponseDto })
    async login(@Body() dto: LoginDto, @Ip() ip: string) {
        return this.authService.loginAdmin(dto.username, dto.password, ip);
    }

    @Public()
    @Post('wechat/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'WeChat user login' })
    @ApiResponse({ status: 200, type: LoginResponseDto })
    async wechatLogin(@Body() dto: { code: string; phone?: string }) {
        // In production, exchange code for openId via WeChat API
        // For now, use code as openId for development
        const openId = dto.code;
        return this.authService.loginUser(openId, dto.phone);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    async refreshToken(@CurrentUser() user: CurrentUserPayload) {
        const newToken = await this.authService.refreshToken(user.id, user.isAdmin);
        return { accessToken: newToken };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout (client-side token removal)' })
    async logout() {
        // JWT is stateless, logout is handled client-side
        return { message: 'Logged out successfully' };
    }
}
