import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "src/Entities/AuthEntity";
import { Repository } from "typeorm";

@Injectable()
export class AuthComponentService{
    private CheckCode:boolean;
    constructor( @InjectRepository(AuthEntity) private readonly authRepository:Repository<AuthEntity> ){}

    public getCheckCode():boolean{
        return this.CheckCode;
    }

    public setCheckCode( value:boolean ){
        this.CheckCode = value;
    }

    CheckAuthCode(code:string ):void{
        
        this.authRepository.find({
            where:{
                auth_code:code
            }
        })
        .then(e=>{
            if(e.length > 0){
                this.setCheckCode(true)
                return
            }else{
                this.setCheckCode(false)
                return
            }
        })
        .catch((e)=>{
            this.setCheckCode(false)
            return
        })
    }



}