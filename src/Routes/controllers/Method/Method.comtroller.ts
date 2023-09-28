import { Controller , Get , Req , Res } from "@nestjs/common";
import { MethodService } from "src/Routes/services/Method.service";

@Controller("/api/v1/method")
export class MethodController{
    constructor(
        private methodService:MethodService
    ){}

    @Get()
    async AllMethods( @Req() req , @Res() res ){

        await this.methodService.HandleMethods()
        res.send( await this.methodService.getMessage() )

    }
}