import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "src/Entities/AuthEntity";
import { MethodEntity } from "src/Entities/MethodEntity";
import { RoleEntity } from "src/Entities/RoleEntity";
import { StatusEntity } from "src/Entities/StatusEntity";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { MessageType } from "src/components/MessageType";
import { error } from "console";
import { ResumeDTO } from "src/DTO/ResumeDTO";
import { AuthValidition } from "src/validations/AuthValid";
import e from "express";

@Injectable()
export class ResumeService{
    private message:MessageType
    private authService:AuthService    
    constructor(
        @InjectRepository(AuthEntity) private authRepository:Repository<AuthEntity>,
        @InjectRepository(MethodEntity) private methodRepository:Repository<MethodEntity>,
        @InjectRepository(StatusEntity) private statusRepository:Repository<StatusEntity>,
        @InjectRepository(RoleEntity) private roleRepository:Repository<RoleEntity>,
    ){
        this.authService = new AuthService( 
            authRepository,
            methodRepository,
            roleRepository,
            statusRepository,
        )
    }

    //Message
    getMessage():MessageType{
        return this.message;
    }
    setMessage( message:MessageType ):void{
        this.message = message
    }
    //End Message
    async createResume( headline:string , givedname:string , familyname:string, phone:string, address:string, pob:string, dob:Date, educations:ResumeDTO["resume_educations"], skills:ResumeDTO["resume_skills"], languages:ResumeDTO["resume_languages"], hobbies:ResumeDTO["resume_hobbies"], references:ResumeDTO["resume_references"], email:string, filename:string ,code:string ):Promise<void>{

        try{
            // await this.authService.FindIdByCode( code )
            if( !headline || headline.length > 500 ){
                this.setMessage({
                    message:"The healine can't null and must less than 500",
                    status:false
                })
            }else if( !givedname || givedname.length > 25 ){
                this.setMessage({
                    message:"The givedname can't null and must less than 25",
                    status:false
                })
            }else if( !familyname || familyname.length > 25 ){
                this.setMessage({
                    message:"The family can't null and must less than 25",
                    status:false
                })
            }else if( !phone || phone.length > 30 ){
                this.setMessage({
                    message:"The phone can't null and must less than 25",
                    status:false
                })
            }else if( !address || address.length > 500 ){
                this.setMessage({
                    message:"The address can't null and must less than 500",
                    status:false
                })
            }else if( !dob || !new Date(dob) ){
                this.setMessage({
                    message:"The date of birth can't null and must date",
                    status:false
                })
            }else if( !pob || pob.length > 150 ){
                this.setMessage({
                    message:"The place of birth can't null and must less than 150",
                    status:false
                })
            }else if(educations.length < 1){
                this.setMessage({
                    message:"The educations must added less than 0",
                    status:false
                })
            }else if( skills.length < 1 ){
                this.setMessage({
                    message:"The skills must added less than 0",
                    status:false
                })
            }else if( languages.length < 1 ){
                this.setMessage({
                    message:"The languages must added less than 0",
                    status:false
                })
            }else if( !new AuthValidition().isEmail( email ) ){
                this.setMessage({
                    message:"Check your email again",
                    status:false
                })
            }else{
                
            }
        }
        catch(e){
            this.setMessage({
                message:"Created error",
                status:false,
                error:error
            })
        }

    }

}