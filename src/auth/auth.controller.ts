import { Body, Controller, Get, HttpException, Post, Req, Res } from '@nestjs/common';
import { loginDto } from './dto/login.dto'
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';
import { RequestTokenDto } from 'src/user/dto/requestToken.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('signup')
    async signup(@Body() userDto: UserDto) {
        await this.authService.signup(userDto);
        return {
            message: 'User Registered Successfully, OTP Sent to your mail. Login to verify your account'
        }
    }

    @Post('login')
    async login(
        @Body() dto: loginDto, @Res({ passthrough: true }) res: Response
    ){
        return this.authService.login(dto,res);
    }

    @Post('request-otp')
    async requestOTP(@Body() dto: RequestTokenDto) {
        return this.authService.requestOtp(dto);        
    }

    @Post('refresh-token')
    refreshToken(@Req() request:Request){
        return this.authService.refreshAccessToken(request)
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken') 
    res.clearCookie('refreshToken')
    return { message: 'Logged out successfully' }
}
}

