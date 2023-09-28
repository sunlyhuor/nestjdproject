import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { ResumeEntity } from 'src/Entities/ResumeEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { ResumeController } from 'src/Routes/controllers/Resume/resume.controller';
import { ResumeService } from 'src/Routes/services/Resume/resume.service';
import { AuthService } from 'src/Routes/services/auth/auth.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthEntity, ResumeEntity, StatusEntity, MethodEntity, RoleEntity])
    ],
    controllers: [ResumeController],
    providers: [ResumeService, AuthService],
})
export class ResumeModule {}
