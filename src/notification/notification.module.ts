import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationRepository } from './notification.repository';
import { DataSource } from 'typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
   imports:[TypeOrmModule.forFeature([Notification]),UserModule],
     providers: [
        NotificationService,
        {
          provide: NotificationRepository,
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(Notification).extend(NotificationRepository.prototype);
          },
          inject: [DataSource],
        },
      ],
    controllers: [NotificationController],
    exports: [NotificationRepository,NotificationService],
})
export class NotificationModule {}
