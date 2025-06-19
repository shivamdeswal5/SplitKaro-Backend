import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OTP } from "./entities/otp.entity";
import { OtpService } from "./otp.service";
import { JwtModule } from "@nestjs/jwt";
import { OtpRepository } from "./otp.repository";
import { DataSource } from "typeorm";


@Module({
  imports: [TypeOrmModule.forFeature([OTP]), JwtModule],
  providers: [
    OtpService,
    {
      provide: OtpRepository,
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(OTP).extend(OtpRepository.prototype);
      },
      inject: [DataSource],
    },
  ],
  exports: [OtpService,OtpRepository]

})
export class OtpModule { }