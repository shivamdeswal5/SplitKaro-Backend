import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),CloudinaryModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(User).extend(UserRepository.prototype);
      },
      inject: [DataSource],
    },
  ],
  exports: [UserRepository,UserService]
})
export class UserModule { }
