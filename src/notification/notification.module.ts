import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { NotificationRepository } from './notification.repository';
import { DataSource } from 'typeorm';

@Module({
   imports:[TypeOrmModule.forFeature([Notifications])],
     providers: [
        NotificationService,
        {
          provide: NotificationRepository,
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(Notifications).extend(NotificationRepository.prototype);
          },
          inject: [DataSource],
        },
      ],
    controllers: [NotificationController],
    exports: [NotificationRepository,NotificationService],
})
export class NotificationModule {}
