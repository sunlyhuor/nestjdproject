import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { CourseEntity } from 'src/Entities/CourseEntity';
import { PaymentEntity } from 'src/Entities/PaymentEntity';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { MessageType } from 'src/components/MessageType';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { BuyCoursesEntity } from 'src/Entities/BuyCourseEntity';
import { components } from 'src/components/components';
import { error } from 'console';
// import 

@Injectable()
export class BuyCourseService{

        private message:MessageType
        private authService:AuthService

        constructor(
            @InjectRepository(AuthEntity) private authRepository:Repository<AuthEntity>,
            @InjectRepository(CourseEntity) private courseRepository:Repository<CourseEntity>,
            @InjectRepository(StatusEntity) private statusRepository:Repository<StatusEntity>,
            @InjectRepository(PaymentEntity) private paymentRepository:Repository<PaymentEntity>,
            @InjectRepository(MethodEntity) private methodRepository:Repository<MethodEntity>,
            @InjectRepository(RoleEntity) private roleRepository:Repository<RoleEntity>,
            @InjectRepository(BuyCoursesEntity) private buycourseRepository:Repository<BuyCoursesEntity>,
        ){
            this.authService = new AuthService( authRepository , methodRepository , roleRepository , statusRepository )
        }

        public getMessage():MessageType{
            return this.message;
        }

        public setMessage( message:MessageType ):void{
            this.message =  message;
        }
        
        async BuyCourse( course_id:number , payment_id:number , payment_tid :string , code:string ):Promise<void>{

            // this.setMessage({message:await this.authService.getMessage().message , status:true , responses:[ {course_id : course_id } ] })
            await this.authService.FindIdByCode( code )

            if( course_id == null || payment_tid == "" || payment_tid == undefined || payment_id == null ){
                this.setMessage({ message:"The fields can't be emty!" , status:false , tokenIsexpired:false })
            }else if( isNaN( Number(course_id)) || isNaN( Number(payment_id) ) ) {
                this.setMessage({ message:"CourseID and PaymentID must input number!" , status:true , tokenIsexpired:false })
            }
            else{
                
                const buyCourse = await this.buycourseRepository.find({
                    where:{
                        payment_tid:payment_tid
                    }
                })
                if(buyCourse.length > 0){
                    this.setMessage({message:"TID aready used!" , status:false , tokenIsexpired:false})
                }else{
                    const buyCourse = await this.buycourseRepository.find({
                        where:{
                            course:{
                                course_id:course_id
                            },
                            auth:{
                                auth_id:await this.authService.getCheckId()
                            },
                        },
                        order:{
                            buy_course_id:"DESC"
                        }
                    })

                    if( buyCourse.length > 0 && !new components().isExpired( buyCourse[0].expired_date ) ){
                        this.setMessage({message:"Aready bought this course" , status:false , tokenIsexpired:false })
                    }
                    else{

                        const course = await this.courseRepository.find({
                            where:{
                                course_id:course_id,
                                status:{
                                    status_name:"Completed"
                                }
                            }
                        })

                        if( course.length < 1 ){

                            this.setMessage( { message:"This you're can't buy yet!" , status:false , tokenIsexpired:false   } )

                        }else{

                            const payment = await this.paymentRepository.find({
                                where:{
                                    payment_id:payment_id
                                }
                            })

                            if( payment.length < 1 ){
                                this.setMessage({
                                    message:"Choose anther method for cash!",
                                    status:false,
                                    tokenIsexpired:false
                                })
                            }
                            else{

                                if( await this.authService.getMessage().status ){
                                    let price;
                                    const comp = new components()
                                    if( comp.isExpired( course[0].course_discount_date ) ){
                                        price = course[0].course_price
                                    }
                                    else{
                                        price = course[0].course_price - ((course[0].course_price * course[0].course_discount) / 100) 
                                    }

                                    try{
                                        const myDate = new Date()
                                        let newDate = new Date( myDate.getFullYear() , myDate.getMonth() + Number( course[0].course_month ) , myDate.getDate())
                                        // let date = `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getMilliseconds()}`


                                        await this.buycourseRepository.insert({
                                            buy_price: price,
                                            payment:{
                                                payment_id:Number( payment[0].payment_id )
                                            },
                                            payment_tid:payment_tid,
                                            auth:{
                                                auth_id: Number(await this.authService.getCheckId() )
                                            },
                                            status:{
                                                status_id:1
                                            },
                                            course:{
                                                course_id:course_id
                                            },
                                            buy_month: course[0].course_month ,
                                            expired_date: newDate
                                        })
                                        this.setMessage({message:"Bought successully!", status:true , tokenIsexpired:false})
                                        new components().sendMessageToChatBotInvoice()
                            
                                    }
                                    catch(e){
                                        this.setMessage({message:"Error want buying!" , error:e , status:false , tokenIsexpired:false})
                                    }
                                }
                                else{
                                    this.setMessage({message:"You're can't buy!" , status:false , tokenIsexpired:false })
                                }

                            }

                        }

                    }
                }


            }

        }   

        async GetAllBuyCourse(code:string):Promise<void>{
            try{
                // await this.authService.FindIdByCode(code)
                await this.authService.CheckAuth(code , "Admin" )
                if(await this.authService.getAuth()){
                    const buycourse = await this.buycourseRepository.find({
                        select:{
                            buy_course_id:true,
                            course:{
                                course_id:true,
                                course_title:true,
                            },
                            buy_price:true,
                            auth:{
                                auth_id:true,
                                auth_firstname:true,
                                auth_lastname:true,
                                auth_username:true
                            },
                            status:{
                                status_id:true,
                                status_name:true
                            },
                            expired_date:true,
                            payment_tid:true,
                            payment:{
                                payment_id:true,
                                payment_name:true
                            },
                            buy_course_updateat:true
                        },
                        relations:{
                            course:true,
                            auth:true,
                            status:true,
                            payment:true
                        },
                        order:{
                            buy_course_id:"DESC"
                        }
                    })
                    if( buycourse.length > 0 ){
                        this.setMessage({message:"Has data" , status:true , responses:buycourse , tokenIsexpired:false})
                    }else{
                        this.setMessage({message:"No data" , status:false , tokenIsexpired:false})
                    }
                }else{
                    this.setMessage({message:"Not allow" , status:false , tokenIsexpired:false})
                }
            }
            catch{
                this.setMessage({message:"Fetch failed!" , status:false , tokenIsexpired:false})
            }
        }

        async EditStatus(code:string , buyid:number , statusid:number){
    
            await this.authService.CheckAuth(code , "Admin")
            if( await this.authService.getAuth() ){
                if( buyid == null || statusid == null ){
                    this.setMessage({message:"Please input all of fields" , status:false , tokenIsexpired:false })
                }else if( isNaN( Number( buyid ) ) || isNaN( Number( statusid ) ) ){
                    this.setMessage({message:"BuyId and StatusId field must number!" , status:false , tokenIsexpired:false })
                }else{
                    const buycourse = await this.buycourseRepository.find({
                        where:{
                            buy_course_id:Number(buyid)
                        }
                    })

                    if( buycourse.length < 1 ){
                        this.setMessage({message:"Have no buy course id you're edit!" , status:false , tokenIsexpired:false })
                    }else{

                        const status = await this.statusRepository.find({
                            where:{
                                status_id:Number(statusid)
                            }
                        })

                        if( status.length < 1 ){
                            this.setMessage({message:"Choose another status!" , status:false , tokenIsexpired:false })
                        }else{
                            try {
                                const ck = await this.buycourseRepository.find({
                                    where:{
                                        buy_course_id:Number(buyid),
                                        status:{
                                            status_id:statusid
                                        }
                                    }
                                })
                                if( ck.length < 1 ){
                                    const dt = new Date()
                                    const newDates = new Date( dt.getFullYear() , dt.getMonth() + buycourse[0].buy_month , dt.getDate() )
                                    await this.buycourseRepository.update(
                                        {
                                            buy_course_id:buyid
                                        },
                                        {
                                            status:{
                                                status_id:statusid
                                            },
                                            expired_date:newDates
                                        }
                                    )

                                    this.setMessage({message:"Uupdated successfully!" , status:true , tokenIsexpired:false })
                                }else{
                                    this.setMessage({message:"Already updated!" , status:true , tokenIsexpired:false })
                                }

                            } catch (error) {
                                this.setMessage({message:"Uupdated status error!" , status:false , tokenIsexpired:false , error:error })
                            }
                        }

                    }

                }
            }else{
                this.setMessage({message:"Not allow" , status:false , tokenIsexpired:false})
            }

        }

        async GetMyCart( code ):Promise<void>{

            try {
                await this.authService.FindIdByCode( code )
                const datas = await this.buycourseRepository.find({
                    where:{
                        auth:{
                            auth_id:Number( this.authService.getCheckId())
                        },
                    },
                    relations:{
                        auth:true,
                        course:true,
                        status:true
                    },
                    select:{
                        auth:{
                            auth_id:true,
                            auth_firstname:true,
                            auth_lastname:true,
                            auth_photo:true
                        },
                        course:{
                            course_id:true,
                            course_title:true,
                            course_thumbnail:true
                        },
                        status:{
                            status_id:true,
                            status_name:true
                        }
                    },
                    order:{
                        buy_course_id:"DESC"
                    },
                    
                })
                this.setMessage({message:"Fetching successfully" , status:true , tokenIsexpired:false , responses:datas})
            } catch (error) {
                this.setMessage({message:"Fetching Faileds" , status:false , tokenIsexpired:false , error:error})
            }

        }

        async EditTID( code:string , tid:string , buy_course_id:number ):Promise<void> {

            if( tid == null || tid == undefined || tid == "" ){
                this.setMessage({message:"Please input your new TID!" , status:false , tokenIsexpired:false})
            }else if(buy_course_id == null || isNaN( buy_course_id ) ){
                this.setMessage({message:"Please select course in your cart!" , status:false , tokenIsexpired:false})
            }
            else{

                try{
                    await this.authService.FindIdByCode(code)
                    const datas = await this.buycourseRepository.find({
                        where:{
                            payment_tid:tid
                        }
                    })

                    if( datas.length < 1 ){
                        await this.buycourseRepository.update(
                            { 
                                auth:{
                                    auth_id:await this.authService.getCheckId()
                                },
                                buy_course_id:buy_course_id
                            },
                            {
                                payment_tid:tid,
                                status:{
                                    status_id:1
                                }
                            }
                        )

                        new components().sendMessageAfterUpdateTID( buy_course_id )
                        this.setMessage({message:"Update successfully!" , status:true , tokenIsexpired:false})
                    }else{
                        this.setMessage({message:"TID already used!" , status:false , tokenIsexpired:false})
                    }

                }catch(e){
                    this.setMessage({message:"Edit failed" , status:false , tokenIsexpired:false , error:e})
                }

            }


        }

        async DeleteByID( id:number , code:string ):Promise<void>{
            try {
                if( isNaN( id ) ){
                    this.setMessage(
                        {
                            message:"Please input more id",
                            status:false
                        }   
                    ) 
                }
                else{
                    await this.authService.CheckAuth( code , "Admin" )
                    if( await this.authService.getAuth() ){

                        const datas = await this.buycourseRepository.find({
                            where:{
                                buy_course_id:Number(id)
                            }
                        })
                        if( datas.length > 0 ){
                            try{
                                await this.buycourseRepository.delete({
                                    buy_course_id:Number(id),
                                })
                                this.setMessage({
                                    message:"Deleted successfully",
                                    status:true
                                })
                            }catch(e){
                                this.setMessage({
                                    message:"",
                                    status:false,
                                    error:error
                                })
                            }
                        }else{
                            this.setMessage({
                                message:"Please selected another buy course id",
                                status:false
                            })
                        }

                    }   
                    else{
                        this.setMessage({
                            message:"Not allow to delete!",
                            status:false
                        })
                    }
                }
            } catch (error) {
                this.setMessage(
                    {
                        message:"Delete error",
                        error:error,
                        status:false
                    }
                )
            }
        }

}
