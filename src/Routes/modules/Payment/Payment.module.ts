import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentEntity } from "src/Entities/PaymentEntity";
import { PaymentController } from "src/Routes/controllers/Payment/Payment.controller";
import { PaymentService } from "src/Routes/services/Payment/Payment.service";

@Module({
    imports:[ TypeOrmModule.forFeature( [ PaymentEntity ] ) ],
    providers:[ PaymentService ],
    controllers:[ PaymentController ]
})
export class PaymentModule{}