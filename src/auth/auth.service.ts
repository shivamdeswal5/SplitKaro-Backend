import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { loginDto } from './dto/login.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { OTPType } from 'src/otp/type/otp-type';
import { OtpService } from 'src/otp/otp.service';
import { MailerService } from '@nestjs-modules/mailer';
import { RequestTokenDto } from 'src/user/dto/requestToken.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response,Request } from 'express';



@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpService: OtpService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
    ){}

    async signup(dto:UserDto){
        const {email,password,firstName,lastName} = dto;
        const existingUser = await this.userRepository.findOne({where:{email:email}});
        if(existingUser){
            throw new HttpException('User already exists',409);
        }
        const newUser = this.userRepository.create({
            email,
            password,
            firstName,
            lastName
        })
            
        await this.userRepository.save(newUser);
        return this.emailVerification(newUser,OTPType.OTP);
    }

    async login(dto:loginDto,res:Response){
        const {email,password,otp} = dto;
        try{
            const user = await this.userRepository.findOne({where:{email:email}});
            if(!user){
                throw new HttpException('User not found',404);
            }

            const isPasswordValid = await bcrypt.compare(password,user.password);
            if(!isPasswordValid){
                throw new HttpException('Invalid Password',401);
            }
            console.log("Login User: ", user);

            if(user.accountStatus === 'unverified'){
                if(!otp){
                    return {
                        message: `Account not Verified. Please Login with OTP or Request New`
                    }
                }else{
                    console.log("Verifying OTP ...");
                    await this.verifyToken(user.id, otp);
                }
            }

            const {accessToken,refreshToken} = await this.generateAccessAndRefershToken(user.id);

            res.cookie('accessToken',accessToken,{
                httpOnly: true,
                expires: new Date(new Date().getTime()+ 20 * 60 * 1000)
            })
            .cookie("refreshToken",refreshToken,{
                httpOnly: true,
                expires: new Date(new Date().getTime() + 40 * 60 * 1000)
            })

            res.send({
                message: "User Logged In Successfully",
                accessToken:accessToken,
                refreshToken: refreshToken,
                userId: user.id,
                email: user.email
            })
            
        }catch(error){
            if(error instanceof HttpException || error instanceof UnauthorizedException){
                throw error;
            }
        }
    }

    async emailVerification(user:User,otpType:OTPType){
        const token = await this.otpService.generateToken(user,otpType);
        const emailData = {
            to:user.email,
            from: process.env.EMAIL_USER,
            subject: 'OTP For Verification',
            html: 
            `<p>
                Dear ${user.firstName} ${user.lastName},<br><br>Thank you for signing up with us. <br><br>To verify your email. Please enter the following One Time Password (OTP): <b>${token}</b><br>
                This OTP is valid for 5 minutes from the receipt of this email. <br>
                <br>Best regards,<br>Zenmonk
            </p>`
        }  
        
        return await this.mailerService.sendMail(emailData);
    }

    async requestOtp(dto: RequestTokenDto){ 
        const { email } = dto;
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new HttpException('User not Found', 404);
        }
        await this.emailVerification(user,OTPType.OTP)
        return { message: 'OTP Sent successfully ..' }
        
    }

    async verifyToken(userId:string, token:string): Promise<User>{
        await this.otpService.validateOtp(userId,token);
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new UnauthorizedException('User not found')
        }

        user.accountStatus = 'verified'
        await this.userRepository.save(user);
        console.log("USER: ", user);
        return user;
        
    }

    async generateAccessAndRefershToken(userId: string) {
        try {
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user) {
                throw new HttpException('User not found', 404);
            }
            const payload = { id: user.id, email: user.email };
            const accessToken = this.jwtService.sign(payload);
            const refreshToken = this.jwtService.sign({ payload }, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '1hr' })
            user.refreshToken = refreshToken;
            this.userRepository.save(user);
            return {
                accessToken,
                refreshToken,
            }

        } catch (error) {
            throw new HttpException("Something Went Wrong While Generating Tokens", 500);
        }

    }

    async refreshAccessToken(req: Request) {
        const incomingRefreshToken = req.cookies.refreshToken;
        console.log("Incoming Refresh Token: ",incomingRefreshToken);
        if (!incomingRefreshToken) {
            throw new UnauthorizedException('Unauthorized Request')
        }

        try {
            const decodedToken = this.jwtService.verify(incomingRefreshToken,
                {
                    secret: process.env.REFRESH_TOKEN_SECRET
                }
            )

            console.log("decoded token: ",decodedToken);

            const user = await this.userRepository.findOne({
                where: {
                    id: decodedToken?.id
                }
            })

            console.log("User: ",user);

            if (!user) {
                throw new HttpException('Invalid Refresh Token', 401);
            }

            if (incomingRefreshToken !== user?.refreshToken) {
                throw new HttpException('Refresh Token Expired', 401)
            }

            const { accessToken, refreshToken } = await this.generateAccessAndRefershToken(user?.id);
            return {
                message: "Access Token Refreshed",
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw error

        }
    }
}
