import { ResumeModule } from './Routes/modules/Resume/resume.module';
import { TestModule } from './Routes/modules/Test/test.module';
import { BlogModule } from './Routes/modules/blog/blog.module';
import { CourseblogdetailModule } from './Routes/modules/CourseBlogDetail/courseblogdetail.module';
import { CategoryModule } from './Routes/modules/category/category.module';
import { StatusModule } from './Routes/modules/status/status.module';
import { CourseModule } from './Routes/modules/course/course.module';
import { AuthModule } from './Routes/modules/auth/auth.module';
import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MethodEntity } from './Entities/MethodEntity';
import { RoleEntity } from './Entities/RoleEntity';
import { AuthEntity } from './Entities/AuthEntity';
import { BlogEntity } from './Entities/BlogEntity';
import { BuyCoursesEntity } from './Entities/BuyCourseEntity';
import { BuyPlanEntity } from './Entities/BuyPlanEntity';
import { CategoryEntity } from './Entities/CategoryEntity';
import { CourseBlogCategoryDetailEntity } from './Entities/CourseBlogCategoryDetailEntity';
import { CourseEntity } from './Entities/CourseEntity';
import { DisLikeEntity } from './Entities/DisLikeEntity';
import { LikeEntity } from './Entities/LikeEntity';
import { EpisodeEntity } from './Entities/EpisodeEntity';
import { MediaEntity } from './Entities/MediaEntity';
import { PaymentEntity } from './Entities/PaymentEntity';
import { PlanCourseDetailEntity } from './Entities/PlanCourseDetailEntity';
import { PlanEntity } from './Entities/PlanEntity';
import { StatusEntity } from './Entities/StatusEntity';
import {
  UploadMedia,
  UploadProfile,
  UploadThumbnail,
} from './Multers/UploadProfile';
// import * as dotenv from "dotenv"
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MediaModule } from './Routes/modules/media/media.module';
import { CheckRefreshToken, CheckToken, verifyToken } from './JWT/jwt';
import { CheckFile, CheckFiles, Filter } from './middleware/middleware';
import { BuyCourseModule } from './Routes/modules/BuyCourse/BuyCourse.module';
import { upload, validateFile } from './Multers/UploadVideo';
import { MigrateModule } from './migrate/migrate.module';
import { MethodModule } from './Routes/modules/Method/Method.module';
import { PaymentModule } from './Routes/modules/Payment/Payment.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ResumeEntity } from './Entities/ResumeEntity';
// Redis

@Module({
  imports: [
    ResumeModule,
    TestModule,
    // RateLimiteModule,
    // CacheModule.register(),
    // TelegramModule,
    PaymentModule,
    MethodModule,
    MigrateModule,
    BuyCourseModule,
    BlogModule,
    CourseblogdetailModule,
    CategoryModule,
    StatusModule,
    CourseModule,
    AuthModule,
    MediaModule,
    ConfigModule.forRoot({
      envFilePath: join('.env'),
    }),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 20
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: "192.168.0.112",
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      entities: [
        ResumeEntity,
        AuthEntity,
        BlogEntity,
        BuyCoursesEntity,
        BuyPlanEntity,
        CategoryEntity,
        CourseBlogCategoryDetailEntity,
        CourseEntity,
        DisLikeEntity,
        LikeEntity,
        EpisodeEntity,
        MediaEntity,
        MethodEntity,
        PaymentEntity,
        PlanCourseDetailEntity,
        PlanEntity,
        RoleEntity,
        StatusEntity,
      ],
      synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {


    consumer
      .apply(UploadProfile.single('profile'), CheckFile)
      .forRoutes({
        path: '/api/v1/auth/signupwithphoto',
        method: RequestMethod.POST,
      });

    consumer
      .apply(CheckRefreshToken)
      .forRoutes({
        path: '/api/v1/auth/user/newtoken',
        method: RequestMethod.POST,
      });

    consumer
      .apply(CheckToken)
      .forRoutes(
        { path: '/api/v1/auth/user/profile', method: RequestMethod.GET },
        { path: '/api/v1/auth/user/update', method: RequestMethod.PUT },
        { path: '/api/v1/course/create', method: RequestMethod.POST },
        { path: '/api/v1/course/delete', method: RequestMethod.DELETE },
        { path: '/api/v1/course/update/category', method: RequestMethod.PUT },
        { path: '/api/v1/course/delete/category', method: RequestMethod.DELETE },
        { path: '/api/v1/course/add/categories', method: RequestMethod.POST },
        { path: '/api/v1/media/delete', method: RequestMethod.DELETE },
        { path: '/api/v1/blog/create', method: RequestMethod.POST },
        { path: '/api/v1/blog/update', method: RequestMethod.PUT },
        { path: '/api/v1/blog/admin/blog', method: RequestMethod.GET },
        { path: '/api/v1/blog/delete', method: RequestMethod.DELETE },
        { path: '/api/v1/blog/add/categories', method: RequestMethod.POST },
        { path: '/api/v1/blog/delete/categories', method: RequestMethod.DELETE },
        { path: '/api/v1/blog/update/categories', method: RequestMethod.PUT },
        { path: '/api/v1/course/update/course', method: RequestMethod.PUT },
        { path: '/api/v1/course/update/status', method: RequestMethod.PUT },
        { path: '/api/v1/buycourse/buy', method: RequestMethod.POST },
        { path: '/api/v1/buycourse', method: RequestMethod.GET },
        { path: '/api/v1/buycourse/edit-status', method: RequestMethod.PUT },
        { path: 'api/v1/course/post/episode', method: RequestMethod.POST },
        { path: 'api/v1/course/update/episode', method: RequestMethod.PUT },
        { path: 'api/v1/buycourse/mycart', method: RequestMethod.GET },
        { path: 'api/v1/course/admin/course', method: RequestMethod.GET },
        { path: 'api/v1/buycourse/edit-tid', method: RequestMethod.PUT },
        { path: 'api/v1/course/update/thumbnail', method: RequestMethod.PUT },
        { path: 'api/v1/buycourse/delete', method: RequestMethod.DELETE },
        // /update/thumbnail

      );

    consumer
      .apply(CheckToken, UploadMedia.array('medias'), CheckFiles)
      .forRoutes({ path: '/api/v1/media/upload', method: RequestMethod.POST });

    consumer
      .apply(UploadThumbnail.single('thumbnail'), CheckFile, Filter)
      .forRoutes(
        { path: '/api/v1/course/create', method: RequestMethod.POST },
        { path: '/api/v1/blog/create', method: RequestMethod.POST },
        { path: '/api/v1/course/update/thumbnail', method: RequestMethod.PUT }
      );

    consumer
      .apply(upload.single("video"), validateFile)
      .forRoutes(
        { path: 'api/v1/course/post/episode', method: RequestMethod.POST },
      )

  }
}
