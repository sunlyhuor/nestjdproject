import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MethodEntity } from "src/Entities/MethodEntity";
import { MethodController } from "src/Routes/controllers/Method/Method.comtroller";
import { MethodService } from "src/Routes/services/Method.service";

@Module({
    imports:[ TypeOrmModule.forFeature( [ MethodEntity ] ) ],
    providers:[ MethodService ],
    controllers:[ MethodController ]
})
export class MethodModule{}