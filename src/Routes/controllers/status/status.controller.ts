/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Res } from '@nestjs/common';
import { StatusService } from 'src/Routes/services/status/status.service';

@Controller()
export class StatusController {
    constructor(
        private statusService:StatusService
    ){}

    @Get("/api/v1/status")
    async GetDate( @Res() res ){
        await this.statusService.GetStatus()
        if( await this.statusService.getMessage().status ){
            res.status(201).send( await this.statusService.getMessage() )
        }else{
            res.status(301).send( await this.statusService.getMessage() )
        }
    }
}
