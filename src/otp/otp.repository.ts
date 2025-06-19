import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OTP } from './entities/otp.entity';

@Injectable()
export class OtpRepository extends Repository<OTP> {
  constructor(private readonly dataSource: DataSource) {
    super(OTP, dataSource.createEntityManager());
  }

}