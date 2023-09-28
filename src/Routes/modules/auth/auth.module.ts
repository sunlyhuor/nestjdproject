import { AuthService } from '../../services/auth/auth.service';
import { AuthController } from '../../controllers/auth/auth.controller';
import { Module , NestModule , MiddlewareConsumer , RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { AuthComponentService } from 'src/components/auth.component.service';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { GoogleAuthService } from 'src/Routes/services/auth/google.auth.service';
import { MailerController } from 'src/Mailer/mailer.controller';
import { MailerService } from 'src/Mailer/mailer.service';
// import { BuyCourseModule } from './home/sun-leehuor/all/projects/server/src/Routes/modules/BuyCourse/BuyCourse.module';

@Module({
  imports: [ TypeOrmModule.forFeature([AuthEntity , StatusEntity , RoleEntity , MethodEntity])],
  controllers: [AuthController , MailerController],
  providers: [AuthService , AuthComponentService , GoogleAuthService , MailerService],
})
export class AuthModule{}
