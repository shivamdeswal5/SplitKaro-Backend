import { HttpException, Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { OTPType } from './type/otp-type';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { MoreThan } from 'typeorm';

@Injectable()
export class OtpService {
    constructor(
        private readonly otpRepository:OtpRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}

    async generateToken(user:User, type:OTPType){
        const otp = crypto.randomInt(100000,999999).toString();
        const hashedOTP = await bcrypt.hash(otp,10);
        const expiresAt = new Date(new Date().getTime()+ 5 * 60 * 1000);

        const existingOTP = await this.otpRepository.findOne({
            where:{user:{id:user.id},type}
        })

        if(existingOTP){
            existingOTP.token = hashedOTP;
            existingOTP.expiresAt = expiresAt;
            await this.otpRepository.save(existingOTP);
            return otp;
        }
        const otpEntity = this.otpRepository.create({
            user,
            token:hashedOTP,
            type,
            expiresAt,
        })

        await this.otpRepository.save(otpEntity);
        return otp;

    }

    async validateOtp(userId:string, token: string): Promise<Boolean>{
        const validateToken = await this.otpRepository.findOne({
            where:{
                user:{id:userId},
                expiresAt: MoreThan(new Date())
            }
        });

        if(!validateToken){
            throw new HttpException('Otp is Expired. Request a new one', 406);
        }

        const isMatch = await bcrypt.compare(token,validateToken.token);
        if(!isMatch){
            throw new HttpException('Invalid OTP, Please try again ...',401);
        }

        return true;

    }
}
