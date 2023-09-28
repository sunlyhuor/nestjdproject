import { CategoryService } from './../../services/category/category.service';
import { CategoryController } from './../../controllers/category/category.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/Entities/CategoryEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature( [ CategoryEntity ] )
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
