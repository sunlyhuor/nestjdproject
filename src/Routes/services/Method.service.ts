import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { error } from "console";
import { MethodEntity } from "src/Entities/MethodEntity";
import { MessageType } from "src/components/MessageType";
import { Repository } from "typeorm";

@Injectable()
export class MethodService{

    private methods:Array<any>
    private message:MessageType

    constructor(
        @InjectRepository( MethodEntity ) private MethodRepository:Repository<MethodEntity> 
    ){}

    setMethod( med ){
        this.methods = med
    }

    getMethods():any{
        return this.methods
    }

    getMessage():MessageType{
        return this.message
    }

    setMessage( mes:MessageType ){
        this.message = mes
    }

    async HandleMethods():Promise<void>{

        try{
            const datas = await this.MethodRepository.find()
            this.setMessage( { message:"Fetching seccessfully!" , status:true , tokenIsexpired:false , responses:datas } )
        }catch(e){
            this.setMessage( { message:"Fetching failed!" , status:false , tokenIsexpired:false , error:e } )
        }

    }

}