import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthEntity } from "src/Entities/AuthEntity";
import { MediaEntity } from "src/Entities/MediaEntity";
import { MethodEntity } from "src/Entities/MethodEntity";
import { RoleEntity } from "src/Entities/RoleEntity";
import { StatusEntity } from "src/Entities/StatusEntity";
import { MediaController } from "src/Routes/controllers/media/media.controller";
import { AuthService } from "src/Routes/services/auth/auth.service";
import { MediaService } from "src/Routes/services/media/media.service";

@Module( {
    imports :[
        TypeOrmModule.forFeature( [AuthEntity , MediaEntity , MethodEntity , StatusEntity , RoleEntity] )
    ],
    controllers:[ MediaController ],
    providers:[ MediaService , AuthService ]
} )
export class MediaModule{}
