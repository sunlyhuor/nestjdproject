import { Controller, Module, Post } from "@nestjs/common";
import { MigrateService } from "./migrate.service";

@Controller("/api/v1/migrate/data/need")
export class MigrateController{
    constructor(
        private readonly migrateService:MigrateService
    ){}

    @Post()
    async PostData(){
        return await this.migrateService.Migrate()
    }

}