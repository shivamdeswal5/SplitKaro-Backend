
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthMiddleware {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {

    const publicPaths = ['/auth/login', '/auth/signup','/auth/request-otp'];
    if (publicPaths.includes(req.path)) {
      return next();
    }
    const token = req.cookies['accessToken']; 
    console.log("Token ..",token)
    if(!token){
        throw new UnauthorizedException('Authorization token missing');
    }
    try {
       const decodedToken = this.jwtService.verify(token,
        {secret:process.env.JWT_SECRET })
        
        req['user'] = decodedToken;
        next();
      
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
