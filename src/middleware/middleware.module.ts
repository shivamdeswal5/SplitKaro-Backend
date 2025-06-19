import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthMiddleware } from "./auth.middleware";


@Module({
  imports: [JwtModule],
  providers: [AuthMiddleware],
  exports: [AuthMiddleware]

})
export class OtpModule { }