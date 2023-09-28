import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { BuyCoursesEntity } from 'src/Entities/BuyCourseEntity';
import { CourseEntity } from 'src/Entities/CourseEntity';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { PaymentEntity } from 'src/Entities/PaymentEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { BuyCourseController } from 'src/Routes/controllers/BuyCourse/BuyCourse.controller';
import { BuyCourseService } from 'src/Routes/services/BuyCourse/BuyCourse.service';

@Module({
  imports: [ TypeOrmModule.forFeature( [ AuthEntity , StatusEntity , PaymentEntity , CourseEntity , RoleEntity , MethodEntity , BuyCoursesEntity ] ) ],
  providers: [BuyCourseService],
  controllers: [BuyCourseController]
})
export class BuyCourseModule { }
