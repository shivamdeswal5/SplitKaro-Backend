import { Module } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';
import { Settlement } from './entities/settlement.entity';
import { SettlementRepository } from './settlement.repository';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports:[TypeOrmModule.forFeature([Settlement]),UserModule,GroupModule,NotificationModule],
       providers: [
          SettlementService,
          {
            provide: SettlementRepository,
            useFactory: (dataSource: DataSource) => {
              return dataSource.getRepository(Settlement).extend(SettlementRepository.prototype);
            },
            inject: [DataSource],
          },
        ],
      controllers: [SettlementController],
      exports: [SettlementRepository,SettlementService],
})
export class SettlementModule {}
