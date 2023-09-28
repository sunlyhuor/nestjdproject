import { CourseblogdetailService } from './../../services/courseblogdetail/courseblogdetail.service';
import { CourseblogdetailController } from './../../controllers/courseblogdetail/courseblogdetail.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { CategoryEntity } from 'src/Entities/CategoryEntity';
import { CourseBlogCategoryDetailEntity } from 'src/Entities/CourseBlogCategoryDetailEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature( [ AuthEntity , MethodEntity , RoleEntity , StatusEntity , CourseBlogCategoryDetailEntity , CategoryEntity ] )
  ],
  controllers: [CourseblogdetailController],
  providers: [CourseblogdetailService],
})
export class CourseblogdetailModule {}
