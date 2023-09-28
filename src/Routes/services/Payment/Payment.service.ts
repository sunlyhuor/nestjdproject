import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "src/Entities/PaymentEntity";
import { MessageType } from "src/components/MessageType";
import { Repository } from "typeorm";

@Injectable()
export class PaymentService{

    private message:MessageType

    constructor(
        @InjectRepository( PaymentEntity ) private paymentRepository:Repository<PaymentEntity>
    ){}

    public getMessage():any{
        return this.message
    }

    public setMessage( mes:MessageType ):void{
        this.message = mes
    }

    public async getAllPayment():Promise<void>{

        try{

            const datas = await this.paymentRepository.find()
            this.setMessage({message:"Fetching successfully" , status:true , tokenIsexpired:false , responses:datas })

        }
        catch(e){
            this.setMessage( {message:"Fetching failed" , status:false , tokenIsexpired:false , error:e} )
        }

    }

}