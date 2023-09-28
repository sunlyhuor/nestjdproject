import { BlogService } from './../../services/blog/blog.service';
import { BlogController } from './../../controllers/blog/blog.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { BlogEntity } from 'src/Entities/BlogEntity';
import { CourseBlogCategoryDetailEntity } from 'src/Entities/CourseBlogCategoryDetailEntity';
import { CategoryEntity } from 'src/Entities/CategoryEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature( [ AuthEntity , StatusEntity , MethodEntity , RoleEntity , BlogEntity , CourseBlogCategoryDetailEntity , CategoryEntity , RoleEntity ] )
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
