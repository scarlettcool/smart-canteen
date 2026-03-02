import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'admin' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'admin123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class LoginResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    expiresIn: number;

    @ApiProperty()
    user: {
        id: string;
        username: string;
        name: string;
        roles: string[];
    };
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

export class WechatLoginDto {
    @ApiProperty({ description: 'WeChat code from wx.login()' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ description: 'Phone number (optional)' })
    phone?: string;
}
