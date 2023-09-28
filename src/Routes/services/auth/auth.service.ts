/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as uuid from "uuid"
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { Repository } from 'typeorm';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { AuthDTO } from 'src/DTO/AuthDTO';
import { AuthValidition } from 'src/validations/AuthValid';
import { createCrypt, verifyPassword } from 'src/bcrypt/bcrypt';
import { VerifiedAccountSignToken, VerifiedAccountVerifyToken, generateRefreshToken, generateToken } from 'src/JWT/jwt';
import { MessageType } from 'src/components/MessageType';
import { components } from 'src/components/components';
import { MailerService } from 'src/Mailer/mailer.service';

@Injectable()
export class AuthService{
    private CheckCode: boolean
    private CheckUsername: boolean
    private CheckEmail: boolean
    private message:MessageType
    private role_entity = new RoleEntity();
    private method_entity = new MethodEntity();
    private CheckStatus: boolean
    private CheckRole:boolean
    private CheckMethod:boolean
    private code:string
    private authdto = new AuthDTO();
    private authvalidation = new AuthValidition();
    private Users:Array<any>;
    private UserProfile:AuthDTO
    private UserProfileVerify:boolean
    private CheckId:number
    private isAuth:boolean

    constructor( 
        @InjectRepository(AuthEntity) private authRepository:Repository<AuthEntity>,
        @InjectRepository(MethodEntity) private methodRepository:Repository<MethodEntity>,
        @InjectRepository(RoleEntity) private roleRepository:Repository<RoleEntity>,
        @InjectRepository(StatusEntity) private statusRepository:Repository<StatusEntity>
    ){
    }


    // Start Getter Setter

        public getCheckId():number{
            return this.CheckId;
        }

        public setCheckId(value:number):void{
            this.CheckId = value
        }

        public getCode():string{
            return this.code
        }

        public setCode(value:string):void{
            this.code = value
        }

        public getCheckRole():boolean{
            return  this.CheckRole;
        }

        public setCheckRole(value:boolean){
            this.CheckRole = value
        }

        public getCheckMethod():boolean{
            return  this.CheckMethod;
        }

        public setCheckMethod(value:boolean){
            this.CheckMethod = value
        }

        public getCheckStatus():boolean{
            return  this.CheckStatus;
        }

        public setCheckUStatus(value:boolean){
            this.CheckStatus = value
        }

        public getCheckUsername():boolean{
            return  this.CheckUsername;
        }

        public setCheckUsername(value:boolean){
            this.CheckUsername = value
        }

        public setCheckEmail(value:boolean){
            this.CheckEmail = value
        }

        public getCheckEmail():boolean{
            return  this.CheckEmail;
        }

        public getMessage():MessageType{
            return this.message
        }

        public setMessage(message:MessageType){
            this.message = message
        }

        public getCheckCode():boolean{
            return this.CheckCode;
        }

        public setCheckCode( value:boolean ){
            this.CheckCode = value;
        }

        public setAllUser( user:Array<any> ):void{
            this.Users = user
        }

        public getAllUsers():any[]{
            return this.Users;
        }

        public setOnlyUser( user:any ):void{
            this.Users = user
        }

        public getOnlyUser():any{
            return this.Users;
        }

        public setUserProfile( profile:AuthDTO ):void{
            this.UserProfile = profile
        }

        public getUserProfile():AuthDTO{
            return this.UserProfile;
        }

        public setUserProfileVerify( value:boolean ):void{
            this.UserProfileVerify = value
        }

        public getUserProfileVerify():boolean{
            return this.UserProfileVerify
        }
        
        public getAuth():boolean{
            return this.isAuth
        }

        public setAuth(value:boolean){
            this.isAuth = value
        }

    // End Of Getter Setter

    // Start Handle Methods
        public async CheckAuthCode(code:string ):Promise<void>{
            
            try {
                const data = await this.authRepository.find({
                    where:{
                        auth_code:code
                    }
                })

                if(data.length > 0){
                    this.setCheckCode(true)
                    return
                }else{
                    this.setCheckCode(false)
                    return
                }

            } catch (error) {            
                this.setCheckCode(false)
            }        
        }

        public async CheckAuthEmail(email:string):Promise<void>{
            try {
                const data = await this.authRepository.find({
                    where:{
                        auth_email:email
                    }
                })
                
                if(data.length > 0){
                    this.setCheckEmail(true)
                }else{
                    this.setCheckEmail(false)
                }
            } catch (error) {            
                this.setCheckEmail(false)
            }
            
        }

        public CheckAuthStatus(status: number):void{

            this.statusRepository.find({
                where:{
                    status_id:status
                }
            })
            .then((e)=>{
                if( e.length > 0 ){
                    this.setCheckUStatus(true)
                    return
                }else{
                    this.setCheckUStatus(false)
                    return
                }
            }).catch(()=>{
                this.setCheckUStatus(false)
                return
            })
            

        }

        public async CheckAuthRole(role:number):Promise<void>{
            try {
                const data = await this.roleRepository.find({
                    where:{
                        role_id:role
                    }
                })
                if( data.length > 0 ){
                    this.setCheckRole(true)
                }else{
                    this.setCheckRole(false)
                }
            } catch (error) {   
                this.setCheckRole(false)
            }
        }

        public async CheckAuthMethod(method:number):Promise<void>{
            try{
                const data = await this.methodRepository.find({
                    where:{
                        method_id:method
                    }
                })

                if(data.length > 0){
                    this.setCheckMethod(true)
                }else{
                    this.setCheckMethod(false)
                }
            }catch(e){
                this.setCheckMethod(false)
            }
        }

        public async AuthInsert( code:string , username:string , firstname:string , lastname:string , password:string , email:string, phone:string  , photo:string ):Promise<void>{


            try {

                const data = await this.authRepository.insert({
                    auth_code:code,
                    auth_username:username,
                    auth_firstname:firstname,
                    auth_lastname:lastname,
                    auth_password:await createCrypt(password),
                    auth_email:email,
                    auth_phone:phone,
                    auth_photo: photo,
                    method:{
                        method_id:1
                    },
                    role:{
                        role_id:2
                    }
                })
                // console.log( data.identifiers[0].auth_id )
                // console.log(  VerifiedAccountSignToken( { id: data.identifiers[0].auth_id.toString()} ) )
                await new MailerService().sendVerifiedToEmail( email , "Verify account" , process.env.WEBSITE_HOST+"api/v1/auth/verify/"+VerifiedAccountSignToken( {id:data.identifiers[0].auth_id.toString()} ) )
                this.setMessage({message:"Congratulation you're signup successfully!" , status:true , tokenIsexpired:false})

            } catch (error) {
                
                this.setMessage({message:"You're can't sign up!" , status:false , tokenIsexpired:false , error:error })

            }

        }

        public async CheckAuthUsername(username:string):Promise<void>{
           
            try {
                
                const data = await this.authRepository.find({
                    where:{
                        auth_username:username
                    }
                })

                if(data.length > 0) this.setCheckUsername(true)
                else this.setCheckUsername(false)

            } catch (error) {   
                this.setCheckUsername(false)
            }

        }

        public generateCode():void{
            this.setCode(uuid.v4().toString())
        }

        public async userUpdate(code:string , firstname:string ,lastname:string , phone:string ):Promise<void>{
            try{    
                await this.FindIdByCode(code)
                await this.authRepository.update(
                    {
                        auth_id:await this.getCheckId()
                    },
                    {
                        auth_firstname:firstname,
                        auth_lastname:lastname,
                        auth_phone:phone
                    }
                )
                this.setMessage({ message:"Updated successfully!!" , status:true , tokenIsexpired:false })

            }
            catch (error) {
                this.setMessage({ message:"Updated failed!!" , status:false , tokenIsexpired:false , error:error })
            }
        }

        public async FindIdByCode(code:string):Promise<void>{
            try {

                const data = await this.authRepository.find({
                    where :{
                        auth_code:code
                    },
                    select:{
                        auth_id:true
                    }
                })

                if( data.length > 0){
                    this.setCheckId(data[0].auth_id)
                    this.setMessage({message:"Has" , status:true})
                }else{
                    this.setMessage( {message:"Not allow" ,status:false} )
                }

            } catch (error) {
                this.setMessage( {message:"Not allow" ,status:false} )
            }
        }


    // End Of Handle Method

    //SignUp User
        public async RegisterWithEmailPassword(username:string , firstname:string , lastname:string , password:string , email:string, phone:string , photo:string ):Promise<void>{

            this.generateCode()

            if( !username || !firstname || !lastname || !password || !email){
                this.setMessage({ message:"You're forgot input something!!" , status:false })
            }else{
                
                // await this.CheckAuthMethod(method)
                // await this.CheckAuthRole(role)
                await this.CheckAuthEmail(email)
                await this.CheckAuthCode( this.getCode() )
                await this.CheckAuthUsername(username)

                // if( !this.getCheckRole() ){
                //     this.setMessage({ message : "Role don't has" , status:false })
                // }else 
                if(this.getCheckEmail()){
                    this.setMessage({ message : "Email's already sign up before!" , status:false })
                }else if(this.getCheckCode()){
                    await this.RegisterWithEmailPassword(username , firstname , lastname , password , email , phone , photo )
                }else if( this.getCheckUsername() ){
                    await this.setMessage({message:"Username's already signup before! please use other uesrname" , status: false})
                } else if( !this.authvalidation.isEmail(email) ){
                    await this.setMessage({message:"Check your email again has something wrong!" , status: false})
                }
                else{
                   try{
                        
                        await this.AuthInsert( this.getCode() , username , firstname , lastname , password , email , phone, photo);
                        new components().sendMessageToChatBot( username )

                   }catch(e){
                        console.log(e)
                   }
                }
            
            }
        }
    //User login
        public async userLogin( auth:AuthDTO ):Promise<void>{

            try {
                
                const data = await this.authRepository.find({
                    where:{
                        auth_email : auth.email,
                        method:{
                            method_id:1
                        },
                    },
                    select:{
                        role:{
                            role_name:true,
                            role_id:true
                        }
                    },
                    relations:{
                        role:true
                    }
                })

                if( data.length > 0 ){
                    const vf = await this.authRepository.find({
                        where:{
                            auth_email : auth.email,
                            method:{
                                method_id:1
                            },
                            auth_verified:'1'
                        },
                        select:{
                            role:{
                                role_name:true,
                                role_id:true
                            }
                        },
                        relations:{
                            role:true
                        }
                    })
                    if( vf.length > 0 ){

                    
                        if( verifyPassword( auth.password , data[0].auth_password ) ){
                            this.setMessage( { 
                                    message:"Sigined successfully!" , 
                                    status:true ,
                                    token: generateToken( { code: data[0].auth_code } ) , 
                                    refresh_token : generateRefreshToken( { code : data[0].auth_code } ),
                                    role:data[0].role.role_name,
                                    code:data[0].auth_code,
                                    verify:true
                                } )
                        }else{
                            this.setMessage( { message:"Something wrong!" , status:false , verify:false } )
                        }
                    }else{
                        this.setMessage( { message:"Your account did't verify yet!!" , status:false ,verify:false } )
                    }
                }else{
                    this.setMessage( { message:"Something wrong!" , status:false , verify:false } )
                }


            } catch (error) {
                this.setMessage( {message:"Something wrong" , status:false , error :error , verify:false} )
            }

        }

    //Select all users
        public async selectAllUsers():Promise<any>{
            try{

                const datas = await this.authRepository.find({
                    select:{
                        auth_code:true,
                        auth_firstname:true,
                        auth_lastname:true,
                        auth_email:true,
                        auth_birth:true,
                        role:{
                            role_id:true,
                            role_name:true
                        },
                        auth_username:true
                    },
                    relations:{
                        role:true
                    }
                })
                if(datas.length  > 0){
                    this.setAllUser(datas)
                    this.setMessage({message: "Fetch successfully" , status: true , responses : datas })
                }else{
                    this.setMessage({message:"No data" , status: false})
                }


            }catch(e){
                this.setMessage({message:"Fetch failed" , status: false})
            }
            
        }
    // Select only user
        public async selectOnlyUser(type:string):Promise<void>{

            try {
                
            const data = await this.authRepository.find({
                    where:{
                        auth_code : type
                    },
                    select:{
                        auth_username:true,
                        auth_code:true,
                        auth_firstname:true,
                        auth_lastname:true,
                        auth_birth:true,
                        auth_phone:true,
                        auth_photo:true
                    }
                })

                if(data.length > 0){
                    this.setOnlyUser(data)
                    this.setMessage({ message:"User fetch successfully!", status:true , tokenIsexpired:false })
                }else{
                    this.setMessage({ message:"No user!", status:false , tokenIsexpired:false })
                }


            } catch (error) {
                // return error
                this.setMessage({ message:"Error fetch!", status:false , tokenIsexpired:false })
            }

        }
    // select profile
        public async selectProfileuser(profile:AuthDTO):Promise<void>{
            try {
                const data = await this.authRepository.find({
                    where: {
                        auth_code:profile.code
                    },
                    relations:{
                        role:true
                    },
                    select:{
                        auth_firstname:true,
                        auth_lastname:true,
                        auth_email:true,
                        auth_photo:true,
                        role:{
                            role_name:true
                        },
                        auth_username:true,
                        auth_phone:true
                    }
                })
                
                if( data.length > 0 ){
                    this.setMessage({ message:"Profile selected successfully!" , status:true  , responses:data})
                }else{
                    this.setMessage({ message:"Not allow!" , status:false })
                }
            } catch (error) {
                console.log(error)
                this.setMessage({ message:"Error selected" , status:false , error:error })
            }
        }

        public async CheckAuth( code:string , type:string ):Promise<void>{
            try{
                const auth = await this.authRepository.find({
                    where:{
                        auth_code:code,
                        role:{
                            role_name:type
                        }
                    }
                })
                if( auth.length > 0 ){
                    this.setAuth(true)
                    this.setMessage({ message :"You're administrator!", status:true , tokenIsexpired:false })
                }
                else{
                    this.setAuth(false)
                    this.setMessage({ message :"You're not administrator", status:false , tokenIsexpired:false })
                }
            }
            catch(e){
                this.setAuth(false)
                this.setMessage({ message :"Failed", status:false , tokenIsexpired:false })
            }
        }

    //User update Firstname and lastname
        public async updateUserFirstnameAndLastnameAndPhone(code:string , firstname:string , lastname:string , phone:any ):Promise<void>{
            if( firstname.length > 20 ){

                this.setMessage({message:"Firstname field too long!" , status:false , tokenIsexpired:false})

            }else if( lastname.length > 20 ){
                this.setMessage({message:"Lastname field too long!" , status:false , tokenIsexpired:false})
            }else{
                await this.userUpdate( code , firstname , lastname , phone )
            }
        }

        public async converttoadmin( email:string , secrete:string ){

            if( secrete != process.env.SECRETE_FOR_ADMIN ){
                this.setMessage({message:"Not allow" , status:false , tokenIsexpired:false})
            }else{
                
                try{
                    
                    const at = await this.authRepository.update(
                        {
                            auth_email:email
                        },
                        {
                            role:{
                                role_id:1
                            }
                        }
                    )
                    if( at ){

                        this.setMessage(
                            {
                                message:"Sucessfully",
                                status:true,
                                tokenIsexpired:false,
                            }
                        )
                    
                    }else{
                        this.setMessage(
                            {
                                message:"Updated failed",
                                status:false,
                                tokenIsexpired:false,
                            }
                        )
                    }

                }catch(e){
                    this.setMessage(
                        {
                            message:"Failed",
                            status:false,
                            tokenIsexpired:false,
                            error:e
                        }
                    )
                }

            }

        }

        public async SignupWithAnother( code:string , picture:string , name:string , email:string , id:number ){

            try {
                const datas = await this.authRepository.find({
                    where:{
                        auth_email:email,
                        auth_code:code,
                        method:{
                            method_id:id
                        }
                    }
                })
                if( datas.length < 1 ){

                    const names = name.split(" ")
                    await this.authRepository.insert({
                        auth_code:code,
                        auth_email:email,
                        auth_username:name.toLocaleLowerCase(),
                        auth_firstname:names[0],
                        auth_lastname:names[1],
                        auth_password:code,
                        auth_photo:picture,
                        method:{
                            method_id:id
                        }
                    
                    })
                    this.setMessage({
                        message:"Signup successfully!",
                        status:true,
                    })
                }else{
                    this.setMessage({
                        message:"This account already signup!",
                        status:false,
                    })
                }

            } catch (error) {
                this.setMessage({
                    message:"Signup failed",
                    status:false,
                    error:error
                })
            }
        }

        async verifyAccount(token:string):Promise<void>{
            const v = await VerifiedAccountVerifyToken(token)
            if( v.status ){
                try {
                    await this.authRepository.update(
                        { 
                            auth_id:v.data.id
                        },
                        {
                            auth_verified:"1"
                        }
                    )
                    this.setMessage({message:"Verified successfully!" , status:true})
                } catch (error) {
                    this.setMessage({message:"Something wrong with your account!" , status:false , error :error})
                }
                // this.setMessage({message:"True" , status:true , responses:[v] })
            }else{
                this.setMessage({message:"Token's expired" , status:false})
            }
        }

        async requestNewVerifyAccount( email:string , password:string ):Promise<void>{
            try {
                const datas = await this.authRepository.find({
                    where:{
                        auth_email:email,
                        method:{
                            method_id:1
                        }
                    }
                })
                if( datas.length > 0 ){

                    if( verifyPassword( password , datas[0].auth_password ) ){
                        new MailerService().sendVerifiedToEmail( datas[0].auth_email , "Verify account" ,  process.env.WEBSITE_HOST+"api/v1/auth/verify/"+VerifiedAccountSignToken( {id:datas[0].auth_id.toString()} ) )
                        this.setMessage({
                            message:"Please check your mail box!",
                            status:true,
                        }) 
                    }else{
                        this.setMessage({
                            message:"Wrong password!",
                            status:false,
                        })    
                    }

                }else{
                    this.setMessage({
                        message:"Something wrong!",
                        status:false,
                    })    
                }
            } catch (error) {
                this.setMessage({
                    message:"Request failed",
                    status:false,
                    error:error
                })
            }
        }

}
