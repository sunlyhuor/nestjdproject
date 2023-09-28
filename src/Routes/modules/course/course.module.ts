import { CourseService } from './../../services/course/course.service';
import { CourseController } from './../../controllers/course/course.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { CategoryEntity } from 'src/Entities/CategoryEntity';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { CourseEntity } from 'src/Entities/CourseEntity';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { CourseBlogCategoryDetailEntity } from 'src/Entities/CourseBlogCategoryDetailEntity';
import { CourseblogdetailService } from 'src/Routes/services/courseblogdetail/courseblogdetail.service';
import { EpisodeEntity } from 'src/Entities/EpisodeEntity';
import { BuyCoursesEntity } from 'src/Entities/BuyCourseEntity';
import { TestSendFile } from 'src/Routes/controllers/course/Test';

@Module({
  imports: [
    TypeOrmModule.forFeature([ AuthEntity , CategoryEntity , MethodEntity , CourseEntity , StatusEntity , RoleEntity , CourseBlogCategoryDetailEntity, BuyCoursesEntity , EpisodeEntity  ])
  ],
  controllers: [CourseController , TestSendFile],
  providers: [CourseService , CourseblogdetailService],
})
export class CourseModule {}
