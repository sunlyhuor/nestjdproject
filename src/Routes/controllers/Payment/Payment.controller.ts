import { Controller, Get, Req, Res } from "@nestjs/common";
import { PaymentService } from "src/Routes/services/Payment/Payment.service";

@Controller("/api/v1/payment")
export class PaymentController{


    constructor(
        private paymentservice:PaymentService
    ){}

    @Get()
    async FetchingData( @Res() res , @Req() req ){

        await this.paymentservice.getAllPayment()
        res.send( await this.paymentservice.getMessage() )

    }


}