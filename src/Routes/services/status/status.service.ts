/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { MessageType } from 'src/components/MessageType';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
    private message:MessageType

    constructor( @InjectRepository(StatusEntity) private statusRepository:Repository<StatusEntity> ){}

    public getMessage():MessageType{
        return this.message
    }

    public setMessage( message:MessageType ):void{
        this.message = message
    }

    public async CheckStatusId(id:number):Promise<boolean>{
        try{

            const status = await this.statusRepository.find({
                where:{
                    status_id:id
                }
            })

            if( status.length > 0 ){
                return true
            }
            else{
                return false
            }


        }catch(e){
            return false
        }
    }

    public async GetStatus():Promise<void>{

        try {
            const datas = await this.statusRepository.find({})
            this.setMessage( { message:"Fetching successfully" , status:true , tokenIsexpired:false , responses:datas } )
        } catch (error) {
            this.setMessage( { message:"" , status:false , tokenIsexpired:false , error:error } )
        }

    }

}
