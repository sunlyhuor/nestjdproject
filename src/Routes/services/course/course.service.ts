/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { CategoryEntity } from 'src/Entities/CategoryEntity';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { CourseEntity } from 'src/Entities/CourseEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { StatusService } from '../status/status.service';
import { MessageType } from 'src/components/MessageType';
import { CourseDTO } from 'src/DTO/CourseDTO';
import { CourseBlogCategoryDetailEntity } from 'src/Entities/CourseBlogCategoryDetailEntity';
import { CourseblogdetailService } from '../courseblogdetail/courseblogdetail.service';
import { unlinkSync } from 'fs';
import { verifyToken } from 'src/JWT/jwt';
import { join } from 'path';
import { EpisodeEntity } from 'src/Entities/EpisodeEntity';
import e from 'express';
import { BuyCoursesEntity } from 'src/Entities/BuyCourseEntity';
import { error } from 'console';
import { components } from "src/components/components"
import * as NodeCache from "node-cache"
import * as uuid from "uuid"

@Injectable()
export class CourseService {

    private authService: AuthService;
    private courseblogdetailservice:CourseblogdetailService
    private statusService: StatusService;
    private message:MessageType
    private allcourses:Array<any>
    private onlycourse:Array<any>
    private node_cache = new NodeCache()

    constructor( 
        @InjectRepository(AuthEntity) private authRepository: Repository<AuthEntity>,
        @InjectRepository(StatusEntity) private statusRepository: Repository<StatusEntity>,
        @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(MethodEntity) private methodRepository: Repository<MethodEntity>,
        @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
        @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
        @InjectRepository(CourseBlogCategoryDetailEntity) private CourseBlogDetailRepository: Repository<CourseBlogCategoryDetailEntity>,
        @InjectRepository(EpisodeEntity) private EpisodeRepository: Repository<EpisodeEntity>,
        @InjectRepository(BuyCoursesEntity) private BuyCourseRepository: Repository<BuyCoursesEntity>,
      ){
        this.authService = new AuthService( authRepository, methodRepository , roleRepository , statusRepository )
        this.statusService = new StatusService( statusRepository )
        this.courseblogdetailservice = new CourseblogdetailService( this.categoryRepository , CourseBlogDetailRepository )
     }

   //Getter And Setter
     public getMessage():MessageType{
      return this.message;
     }
     public setMessage(message:MessageType):void{
         this.message = message
     }
     public setAllCourse(course:Array<any>):void{
         this.allcourses = course
     }
     public getAllCourse():Array<any>{
      return this.allcourses
     }
     public getOnlyCourse():Array<any>{
      return this.onlycourse
     }
     public setOnlyCourse(value:Array<any>):void{
      this.onlycourse = value
     }

     private generateCode():string{
         return (uuid.v4().toString())
      }
      private async checkCode( code:string ):Promise<any>{

         try {
          const data = await this.courseRepository.find({
              where:{
                  course_code:code
              }
          })
          if(data.length > 0){
              return true
          }else{
              return false
          }
         } catch (error) {
          return false
         }

      }

      private async insertCourse( coursedto:CourseDTO , categories:Array<number> , code:string ):Promise<void>{
         try{
            const course = await  this.courseRepository.insert({
               course_title:coursedto.course_title,
               course_description:coursedto.course_description,
               course_discount:coursedto.course_discount,
               course_discount_date: coursedto.course_discount_date,
               course_thumbnail: process.env.DEFAULT_THUMBNAIL_URL+"/"+coursedto.course_thumbnail,
               course_month:coursedto.course_month,
               course_price:coursedto.course_price,
               auth: {
                  auth_id:await this.authService.getCheckId()
               },
               status:{
                  status_id:coursedto.status
               },
               course_code:code
            })
            categories.forEach(async e=>{
               await this.courseblogdetailservice.CoursDetailCreate( e , course.identifiers[0].course_id )
            })
            // this.node_cache.del("allcourses")
            this.setMessage({ message:"Course inserted successfully!" , status:true })
         }
         catch(e){
             unlinkSync( join("src" , "pictures" , "thumbnails/"+coursedto.course_thumbnail ) ) 
            this.setMessage({ message:"Course inserted failed!" , status:false , error:e })
         }
      }

   //End of Getter and Setter

      async CreateCourse(coursedto:CourseDTO , categories:Array<number> , code:string): Promise<void>{

         await this.authService.CheckAuth( coursedto.code , "Admin" )
         if(await this.statusService.CheckStatusId(coursedto.status)){
            if( await this.authService.getAuth() ){
               if( coursedto.course_title == "" || coursedto.course_description == "" || coursedto.course_thumbnail == "" || categories.length < 1 ){
                  unlinkSync( join("src" , "pictures" , "thumbnails/"+coursedto.course_thumbnail ) ) 
                  this.setMessage({ message:"Somethings wrong!" , status:false })
               }else if( coursedto.course_title.length > 50 ){
                  unlinkSync( join("src" , "pictures" , "thumbnails/"+coursedto.course_thumbnail ) ) 
                  this.setMessage({ message:"Title field too long should less than 50char!!" , status:false })
               }else if( coursedto.course_description.length > 250 ){
                  unlinkSync( join("src" , "pictures" , "thumbnails/"+coursedto.course_thumbnail ) ) 
                  this.setMessage({ message:"Description field too long should less than 250char!!" , status:false })
               }
               else{
                    if(coursedto.status == null){
                        coursedto.status = 2
                    }
                    let code_course = this.generateCode()
                    await this.authService.FindIdByCode( code )

                    if( await this.checkCode(code_course) ){
                        // await this.insertCourse(  )
                        code_course = this.generateCode()
                        await this.insertCourse( coursedto , categories , code_course )
                    }else{
                        await this.insertCourse( coursedto , categories , code_course )
                    }
                  // this.setMessage({ message: this.getMessage().message , status:this.getMessage().status })  
               }
            }else{
               unlinkSync( join("src" , "pictures" , "thumbnails/"+coursedto.course_thumbnail ) ) 
               this.setMessage({ message:"Not Allow" , status:false})
            }
         }else{
            unlinkSync( join("src" , "pictures" , "thumbnails/"+coursedto.course_thumbnail ) ) 
            this.setMessage({ message:"Status Doesn't has" , status:false})
         }
      }

      public async CourseSelect( limit:number , page:number ):Promise<void>{
         try{
            let datas:any;
            // if( !this.node_cache.get("allcourses") ){
               if( limit == null || limit == undefined ){
                  datas = await this.courseRepository.find({
                     select:{ 
                        status:{
                           status_id:true,
                           status_name:true,
                        },
                        auth:{
                           auth_id:true,
                           auth_username:true,
                           auth_code:true
                        },
                        categories:true,
                        // buycourses:{
                        //    buy_course_id:true,
                        //    status:{
                        //       status_id:true,
                        //       status_name:true
                        //    },
                        //    auth:{
                        //       auth_code:true,
                        //       auth_username:true
                        //    },
                        //    expired_date:true
                        // }
                     },
                     relations:{
                        status:true,
                        categories:{
                           category:true
                        },
                        auth:true,
                        buycourses:{
                           status:true,
                           auth:true
                        }
                     },
                     order:{
                        course_id:"DESC",
                        buycourses:{
                           buy_course_id:"DESC"
                        }
                     },
                     where:{
                        status:{
                           status_id:2
                        }
                     }
                  })
                  // if( datas.length < 1 ){
                  //    this.node_cache.del( "allcourses" )
                  // }else{
                  //    this.node_cache.set("allcourses" , datas , 60*60)
                  // }
               }else{
                  datas = await this.courseRepository.find({
                     select:{
                        status:{
                           status_id:true,
                           status_name:true,
                        },
                        auth:{
                           auth_id:true,
                           auth_username:true,
                           auth_code:true
                        },
                        categories:true,
                        buycourses:{
                           buy_course_id:true,
                           status:{
                              status_id:true,
                              status_name:true
                           },
                           auth:{
                              auth_code:true,
                              auth_username:true
                           },
                           expired_date:true
                        }
                     },
                     relations:{
                        status:true,
                        categories:{
                           category:true
                        },
                        auth:true,
                        buycourses:{
                           status:true,
                           auth:true
                        }
                     },
                     order:{
                        course_id:"DESC",
                        buycourses:{
                           buy_course_id:"DESC"
                        }
                     },
                     where:{
                        status:{
                           status_id:2
                        }
                     },
                     skip: isNaN( page ) ? 0 * Number(limit) : ( Number(page)-1 ) * Number(limit   ) ,
                     // skip: page ? (Number( page ) - 1 ) * Number(limit) : (1 - 1 ) * Number(limit) ,
                     take:Number(limit)
                  })
                  // if( datas.length < 1 ){
                  //    this.node_cache.del( "allcourses" )
                  // }else{
                  //    this.node_cache.set("allcourses" , datas , 60*60)
                  // }
               }
            // }else{
            //    datas = this.node_cache.get("allcourses")
            // }
            // if(data.length > 0){
               this.setAllCourse( datas )
               this.setMessage({ message:"Selected successfully!" , status:true , responses:datas })
            // }
            // else{
            //    this.setMessage({ message:"No course" , status:false })
            // }
         }
         catch(e){
            this.setMessage({ message:"Error select" , status:false , error:e })
         }
      }

      public async CourseDelete(  code:string , course:number ):Promise<void>{

         try {
            
            await this.authService.CheckAuth(code , "Admin")
            if(await this.authService.getAuth()){

               const cs = await this.courseRepository.find({
                  where:{
                     course_id:course
                  }
               })
               if( cs.length < 1 ){
                  this.setMessage({ message:"No course you're want deleted !" , status:false , tokenIsexpired:false })
               }
               else{
                  await this.courseRepository.delete({
                     course_id:course,
                  })               
                  this.setMessage({ message:"Deleted successfully!" , status:true , tokenIsexpired:false })
                  const image = cs[0].course_thumbnail.split("/")
                  const newImage = image[image.length - 1 ]
                  unlinkSync( join( "src" , "pictures" , "thumbnails/"+newImage ) )
               }
            }
            else{
               this.setMessage({ message:"Not allow!" , status:false , tokenIsexpired:false })
            }
                

         } catch (error) {
            this.setMessage({ message:"Course deleted failed!" , status:false , tokenIsexpired:false })
         }

      }

      public async CourseCategoryUpdate( code:string  , course:number, category:Array<number> , category_update:Array<number>  ):Promise<void>{

         try{
            for( let i = 0; i < category.length ; i++ ){   
               await this.courseblogdetailservice.CourseDetailUpdateCategory(course, category[i] , category_update[i] )
            }
            this.setMessage({ message:"Course updated category successfully!" , status:true , tokenIsexpired:false })
         }
         catch(e){
            this.setMessage({ message:"Course updated category failed" , status:false , tokenIsexpired:false  })
         }

      }

      public async CheckUpdateCategoryCoursePermission(token:string , course:number ):Promise<any>{
         try{
            await this.authService.FindIdByCode(token)
            const datas = await this.courseRepository.find({
               where:{
                  auth:{
                     auth_id: await this.authService.getCheckId()
                  },
                  course_id:course
               }
            })
            if(datas.length > 0){
               this.setMessage({message: 'Has auth' , status:true , tokenIsexpired:false})
            }else{
              this.setMessage({message: "Not allow", tokenIsexpired:false , status:false})
            }
         }
         catch(e){
              this.setMessage({message: 'No auth' , status:false , error:e})
            // return await this.authService.getMessage()
         }
      }

      public async CourseOnlyOne(code:string):Promise<void>{

         try{
            const data = await this.courseRepository.find({
               where:{
                  course_code:code,
                  status:{
                     status_id:2
                  }
               },
               relations:{
                  auth:true,
                  status:true,
                  buycourses:{
                     auth:true,
                     status:true
                  },
                  episodes:{
                     status:true
                  }
               },
               select:{
                  auth:{
                     auth_id:true,
                     auth_lastname:true,
                     auth_photo:true,
                     auth_firstname:true
                  },
                  status:{
                     status_id:true,
                     status_name:true
                  },
                  episodes:{
                     episode:true,
                     episode_id:true,
                     episode_title:true,
                     episode_description:true,
                     episode_url:true,
                     status:{
                        status_id:true,
                        status_name:true
                     }
                  },
                  // buycourses:{
                  //    buy_course_id:true,
                  //    buy_price:true,
                  //    buy_course_createat:true,
                  //    expired_date:true,
                  //    auth:{
                  //       auth_id:true,
                  //       auth_firstname:true,
                  //       auth_lastname:true,
                  //       auth_code:true,
                  //       auth_photo:true
                  //    },
                  //    status:{
                  //       status_id:true,
                  //       status_name:true
                  //    }
                  // }
               }
            })
            if( data.length > 0 ){
               this.setOnlyCourse(data)
               this.setMessage( { message:"Selected successfully" , status:true } )
            }
            else{
               this.setMessage( { message:"No course" , status:true , responses:[]} )
            }
         }
         catch(e){
            this.setMessage( { message:"Fetch failed" , status:false } )
         }

      }

      public async CourseAddCategory(course:number , categories:Array<number> , code:string):Promise<void>{
         await this.CheckUpdateCategoryCoursePermission( code , course )
         if( await this.getMessage().status ){
               await this.authService.FindIdByCode(code)
               categories.forEach(async e=>{
                  const data = await this.CourseBlogDetailRepository.find({
                     where:{
                        course:{
                           course_id:course,
                           auth:{
                              auth_id:await this.authService.getCheckId()
                           }
                        },
                        category:{
                           category_id:e
                        }
                     }
                  })
                  if(data.length < 1){
                     this.courseblogdetailservice.CoursDetailCreate(e , course)
                  }
               })
               this.setMessage({ message:"Added categories to course successfully!  " ,status:true})


         }
         else{
            this.setMessage( { message:"Not allow" , status:false })
         }


      }

      public async CourseDeleteCategories(course:number , categories:Array<number> , code:string){
            await this.CheckUpdateCategoryCoursePermission(code , course)
            if( await this.getMessage().status ){

                  categories.forEach( async e=>{

                     await this.courseblogdetailservice.CourseDetailDeleteCategory( course , e )

                  } )

                  this.setMessage( { message:"Deleted category of course successfully!" , status: true , tokenIsexpired:false })

            }else{
               this.setMessage( { message:"Not Allow" , status: false , tokenIsexpired:false })
            }
      }

      public async CourseUpdate( code:string , course:number , title:string , description:string , status_id:number , discount:number , discount_date:Date , price:number , month:number ):Promise<void>{

         if( course == null || title == "" || title == undefined || description == "" || description == undefined || status_id == null || ( status_id > 3 && status_id < 1 || isNaN(price) || isNaN(month) ) ){
               this.setMessage({ message:"Make sure you are input all fields!" , status:false , tokenIsexpired:false })
         }else{
            if( isNaN( course ) ){
               this.setMessage({message:"Course is number" , status:false , tokenIsexpired:false})
            }else{

                  try {

                     await this.authService.FindIdByCode( code )
                     await this.authService.CheckAuth(code , "Admin")
                     if(await this.authService.getAuth()){

                        const datas = await this.BuyCourseRepository.find({
                           where:{
                              course:{
                                 course_id:course
                              }
                           }
                        })

                        let stat:number;
                        if( datas.length < 1 ){ stat = status_id }
                        else{ stat = 2 }

                        this.courseRepository.update(
                           {
                              course_id:course,
                           },
                           {
                              course_title:title,
                              course_description:description,
                              status:{
                                 status_id:stat
                              },
                              course_discount:discount,
                              course_discount_date:discount_date,
                              course_price:price,
                              course_month:month
                           }
                        )
                        // this.node_cache.del("singlecouese")
                        this.setMessage({ message:"Updated successfully!" , status:true , tokenIsexpired:false })

                     }else{
                        this.setMessage({ message:"Not allow" , status:false , tokenIsexpired:false })
                     }
                  } catch (error) {
                     this.setMessage({ message:"Updated failed!" , status:false , tokenIsexpired:false })
                  }

            }
         }


      }

      public async CourseSelectPagination( limit:number , page:number ):Promise<void>{

         try {
            
            
            const data_length = await this.courseRepository.find({
               where:{
                  status:{
                     status_id:2
                  }
               }
            })
            if( data_length.length > limit ){
               
            }

            const data = await this.courseRepository.find({
               skip:page,
               take:limit,
               where:{
                  status:{
                     status_id:2
                  }
               }
            })
            if( data.length  > 0 ){
               this.setMessage({ message:"Has course" , status:true , responses:data })
            }else{
               this.setMessage({ message:"No course" , status:false })
            }

         } catch (error) {
            this.setMessage({ message:"select error" , status:false })
         }

      }

      public async CourseChangeStatus( code:string , course:number , status:number ):Promise<void> {

         if( course == null || course == undefined || status == null || status == undefined ){
            this.setMessage({ message:"Make sure course or staus not empty before send to server!" , status:false , tokenIsexpired:false})
         }else{

            try {

               await this.authService.FindIdByCode(code)
               const data = await this.courseRepository.find({
                  where:{
                     auth:{
                        auth_id:await this.authService.getCheckId()
                     },
                     course_id:course
                  }
               })

               if( data.length < 1 ){
                  this.setMessage({ message:"Not allow" , status:false , tokenIsexpired:false})
               }else{
                  await this.courseRepository.update(
                     {
                        auth:{
                           auth_id:await this.authService.getCheckId()
                        },
                        course_id:course
                     },
                     {
                        status:{
                           status_id:status
                        }
                     }
                  )
               }

               this.setMessage({ message:"Updated status successfully!" , status:true , tokenIsexpired:false})

            } catch (error) {
               this.setMessage({ message:"Changed failed" , status:false , tokenIsexpired:false})
            }

         }

      }

      public async UplaodEpisode( episode:number , title:string, description:string , course_id:number , status_id:number , filename:string , code:string ):Promise<void>{
            await this.authService.FindIdByCode(code)
            await this.authService.CheckAuth(code , "Admin")
            if( await this.authService.getAuth() ){

               if( episode == null || title == "" || course_id == null || description == "" ){
                  unlinkSync( join( "src" , "pictures" , "videos/"+filename ) )
                  this.setMessage({message:"Make sure input all fields" ,status:false , tokenIsexpired:false})
               }
               else{

                  if( isNaN( course_id ) || isNaN( episode ) ){
                     unlinkSync( join( "src" , "pictures" , "videos/"+filename ) )
                     this.setMessage({message:"Make sure courseID and episode are number! " ,status:false , tokenIsexpired:false})
                  }
                  else{

                     try {

                        const datas = await this.courseRepository.find({
                           where:{
                              course_id:course_id
                           }
                        })

                        if( datas.length < 1 ){
                           unlinkSync( join( "src" , "pictures" , "videos/"+filename ) )
                           this.setMessage({message:"Select course you're wanna add episode! " ,status:false , tokenIsexpired:false})
                        }
                        else{
                              let st:number;
                              if(status_id == null || isNaN(status_id) || (status_id > 2 && status_id < 1) ){
                                 st = 1;
                              }else{
                                 st = status_id
                              }

                              await this.EpisodeRepository.insert({
                                 auth:{
                                    auth_id:await this.authService.getCheckId()
                                 },
                                 episode_title:title,
                                 episode_description:description,
                                 episode:episode,
                                 course:{
                                    course_id:course_id
                                 },
                                 episode_url:filename,
                                 status:{
                                    status_id:st
                                 }
                              })

                              this.setMessage({message:"Episode added successfully! " ,status:true , tokenIsexpired:false})
                        }

                     } catch (error) {
                        unlinkSync( join( "src" , "pictures" , "videos/"+filename ) )
                        this.setMessage({message:"Uplaoded failed" ,status:false , tokenIsexpired:false, error:error })
                     }

                     // this.setMessage({message:"Success! " ,status:true , tokenIsexpired:false})
                  }

               }

            }
            else{
               unlinkSync( join( "src" , "pictures" , "videos/"+filename ) )
               this.setMessage({message:"Not allow to uplaod episode" ,status:false , tokenIsexpired:false})
            }


      }


      public async UpdateEpisode( code:string , title:string , description:string, episode_part:number ,episode_id:number , course_id:number  , status_id:number ):Promise<void>{

         await this.authService.CheckAuth( code , "Admin" )
         if( this.authService.getAuth() ){

            if( title == "" || title == undefined || description == ""|| status_id == null || ( status_id > 2 && status_id < 1  ) || episode_id == null || course_id == null || episode_part == null ){
               this.setMessage({message:"Make sure input all fields" , status:false , tokenIsexpired:false})
            }
            else{
               if( isNaN( episode_id ) || isNaN(course_id) || isNaN(episode_part) || isNaN( status_id ) ){
                  this.setMessage({message:"Episode and Course are number!" , status:false , tokenIsexpired:false})
               }else{

                  try {
                     const course = await this.courseRepository.find({
                        where:{
                           course_id:course_id
                        }
                     })
                     if( course.length < 1 ){
                        this.setMessage({message:"Select course you're wanna change episode!" , status:false , tokenIsexpired:false})
                     }else{

                        const episode = await this.EpisodeRepository.find({
                           where:{
                              episode_id:episode_id,
                              course:{
                                 course_id:course_id
                              }
                           }
                        })

                        if( episode.length < 1 ){
                           this.setMessage({message:"Select episode you're wanna change!" , status:false , tokenIsexpired:false})
                        }
                        else{

                           await this.EpisodeRepository.update(
                              {
                                 course:{
                                    course_id:course_id
                                 },
                                 episode_id:episode_id
                              },
                              {
                                 episode_title:title,
                                 episode_description:description,
                                 episode:episode_part,
                                 status:{
                                    status_id:status_id
                                 }
                              }
                           )
                           this.setMessage({message:"Updated successfully!" , status:true , tokenIsexpired:false })
                        }

                     }
                     

                  } catch (error) {
                     this.setMessage({message:"Updated failed!" , status:false , tokenIsexpired:false , error:error })
                  }


               }
            }

         }else{
            this.setMessage({message:"Not allow" , status:false , tokenIsexpired:false})
         }
      }

      public async adminGetCourse( code:string ){

         await this.authService.CheckAuth(code , "Admin")
         if( await this.authService.getAuth() ){
            try {
               const datas = await this.courseRepository.find({
                  relations:{
                     status:true,
                     auth:true,
                     categories:true,
                     buycourses:true
                  },
                  select:{
                     status:{
                        status_id:true,
                        status_name:true
                     },
                     categories:{
                        category:{
                           category_id:true,
                           category_name:true
                        }
                     },
                     auth:{
                        auth_id:true,
                        auth_firstname:true,
                        auth_lastname:true,
                        auth_username:true
                     },
                     buycourses:{
                        buy_course_id:true
                     }
                  },
                  order:{
                     course_id:"DESC"
                  }
               })

               this.setMessage({message:"Fetching successfully" , status:true , responses:datas , tokenIsexpired:false })

            } catch (error) {
               this.setMessage({ status:false , message:"Fetcing Error" , tokenIsexpired:false })
            }
         }else{
            this.setMessage({message:"Not allow" , status:false , tokenIsexpired:false})
         }


      }

      public async getEpisode(course_title:string ):Promise<void>{

            try {
               const datas = await this.EpisodeRepository.find({
                  relations:{
                     course:{
                        buycourses:true
                     },
                     status:true,
                     auth:true
                  },
                  select:{
                     course:{
                        course_id:true,
                        course_title:true,
                        course_month:true,
                        course_thumbnail:true,
                        course_discount:true,
                        course_discount_date:true,
                        buycourses:{
                           buy_course_id:true,
                           buy_price:true,
                           buy_course_createat:true,
                           expired_date:true,
                           status:{
                              status_id:true,
                              status_name:true
                           }
                        }
                     }
                  },
                  where:{
                     status:{
                        status_id:2
                     },
                     course:{
                        buycourses:{
                           status:{
                              status_id:2
                           }
                        },
                        course_title:course_title
                     }
                  },
                  order:{
                     episode:"ASC"
                  }
               })
               // if( datas.length > 0 ){
                  this.setMessage({message:"Fetching successfully!" , status:true , responses:datas , tokenIsexpired:false})
               // }else{
               //    this.setMessage({message:"No episode yet!" , status:false , tokenIsexpired:false})
               // }
            } catch (error) {
               this.setMessage( {message:"Fetching Failed",status:false , error:error , tokenIsexpired:false} )
            }
         

      }

      public async getVideos(code:string , episode_id:number , course_id:number):Promise<any>{

         try {
            await this.authService.FindIdByCode(code)
            const datas = await this.courseRepository.find(
               {
                  where:{
                     course_id:course_id,
                     episodes:{
                        episode_id:episode_id,
                        status:{
                           status_id:2
                        }
                     },
                     buycourses:{
                        auth:{
                           auth_id:await this.authService.getCheckId()
                        },
                        status:{
                           status_id:2
                        }
                     },
                     status:{
                        status_id:2
                     }
                  },
                  order:{
                     buycourses:{
                        buy_course_id:"DESC"
                     }
                  },
                  relations:{
                     auth:true,
                     episodes:{
                        status:true
                     },
                     buycourses:{
                        auth:true
                     }
                  },
                  select:{
                     buycourses:{
                        buy_course_id:true,
                        buy_price:true,
                        buy_course_createat:true,
                        expired_date:true,
                        auth:{
                           auth_code:true,
                           auth_id:true,
                           auth_username:true,
                           auth_photo:true
                        }
                     },
                     episodes:{
                        episode:true,
                        episode_url:true,
                        episode_description:true,
                        episode_title:true,
                        episode_id:true,
                        status:{
                           status_id:true,
                           status_name:true
                        }
                     }

                  }
               }
            )
            if( datas.length > 0 ){
               if( new components().isExpired( new Date(datas[0].buycourses[0].expired_date) ) ){
                  this.setMessage({message:"User is expired with this course please buy again!" , status:false ,tokenIsexpired:false})
               }else{
                  this.setMessage({message:"Fetching successfully" , responses:datas , status:true ,tokenIsexpired:false })
               }
            }else{
               this.setMessage({message:"Can't watch this episode yet! " , status:false ,tokenIsexpired:false , error:error})
            }
         } catch (error) {
            this.setMessage({message:"Fetching failed" , status:false ,tokenIsexpired:false , error:error})
         }

      }

      public async groupSelectEpisodes( course_id:number ){
         try {
            if( isNaN(course_id) ){
               this.setMessage({message:"/group/episodes/number." , status:false , tokenIsexpired:false})
            }else{
               const datas = await this.EpisodeRepository.find({
                  where:{
                     course:{
                        course_id
                     }
                  },
                  relations:{
                     auth:true,
                     status:true,
                     course:{
                        buycourses:true
                     }
                  },
                  order:{
                     course:{
                        buycourses:{
                           buy_course_id:"DESC"
                        }
                     },
                     episode:"asc"
                  },
                  select:{
                     auth:{
                        auth_username:true,
                        auth_code:true
                     },
                     status:{
                        status_id:true,
                        status_name:true
                     },
                     course:{
                        course_title:true,
                        course_thumbnail:true,
                        course_id:true
                     }
                  }
               })
               this.setMessage({message:"Fetching Successfully" , status:true , tokenIsexpired:false , responses:datas })
            }
         } catch (error) {
            this.setMessage({message:"Fetching failed" , status:false , tokenIsexpired:false , error:error})
         }
      }

      public async updateThumbnail( code:string , course_id:number , file:string ){

         await this.authService.CheckAuth( code , "Admin" )
         if( !await this.authService.getAuth() ){
            this.setMessage({
               message:"Not allow",
               status:false,
               tokenIsexpired:false
            });
         }else{

            if( isNaN( course_id ) || course_id == null ){
               this.setMessage({
                  message:"Course id should number!",
                  status:false,
                  tokenIsexpired:false
               });
            }else{

               try {

                  await this.courseRepository.update(
                     {
                        course_id:course_id
                     },
                     {
                        course_thumbnail:process.env.DEFAULT_THUMBNAIL_URL+"/"+file
                     }
                  )

                  this.setMessage({ 
                     message:"Updated successfully",
                     status:true,
                     tokenIsexpired:false,
                  });  

               } catch (error) {
                  this.setMessage({ 
                     message:"Updated failed",
                     status:false,
                     tokenIsexpired:false,
                     error:error
                  });      
               }

            }

            // this.setMessage({ 
            //    message:"Allow",
            //    status:true,
            //    tokenIsexpired:false
            // });
         }


      }

      public async getPopularCourse( limit:number ) : Promise<void> {

            try {

               const datas = await this.courseRepository.query(`
                  SELECT COUNT(bc.course_id),c.*
                  FROM courses_tb c 
                  INNER JOIN buy_courses_tb bc ON bc.course_id = c.course_id
                  GROUP BY c.course_id
                  ORDER BY COUNT(bc.buy_course_id) DESC
                  LIMIT ${ isNaN( limit ) ? 10 : Number(limit) }
               `)

               this.setMessage({
                  message:"Feching succesfully",
                  tokenIsexpired:false,
                  status:true,
                  responses:await datas
               })

            } catch (error) {
               this.setMessage({
                  message:"Fetching faied",
                  tokenIsexpired:false,
                  status:false,
                  error:error
               })
            }


      }

}
