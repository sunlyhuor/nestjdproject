import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MethodEntity } from "src/Entities/MethodEntity";
import { PaymentEntity } from "src/Entities/PaymentEntity";
import { RoleEntity } from "src/Entities/RoleEntity";
import { StatusEntity } from "src/Entities/StatusEntity";
import { MigrateController } from "./migrate.controller";
import { MigrateService } from "./migrate.service";

@Module({
    imports:[ TypeOrmModule.forFeature( [ StatusEntity , MethodEntity , RoleEntity, PaymentEntity ] ) ],
    controllers:[ MigrateController ],
    providers:[MigrateService]
})
export class MigrateModule{}