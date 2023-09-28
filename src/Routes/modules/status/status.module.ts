import { StatusService } from './../../services/status/status.service';
import { StatusController } from './../../controllers/status/status.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEntity } from 'src/Entities/StatusEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature( [StatusEntity] )
  ],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {

}
