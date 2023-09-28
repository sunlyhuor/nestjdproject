/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller , Post , Get, Req, UploadedFile, Delete, Put, Param  , Res   , Query} from '@nestjs/common';
import { unlinkSync } from 'fs';
import path, { join } from 'path';
import { CourseDTO } from 'src/DTO/CourseDTO';
import { CheckToken, CheckTokenNoMiddleware, verifyToken } from 'src/JWT/jwt';
import { CourseService } from 'src/Routes/services/course/course.service';
import { isArray } from 'util';
import * as express from 'express';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller("api/v1/course")
export class CourseController {
   private courseDTO: CourseDTO;
   constructor( private courseService:CourseService ){}

   @SkipThrottle(false)
   @Get()
   async selectCouse( @Req() req , @Res() res , @Query("limit") limit:number ,  @Query("page") page:number ){
      
      await this.courseService.CourseSelect( limit , page )
      if( await this.courseService.getMessage().status ){
         res.status(201).send(await this.courseService.getMessage())
      }else{
         res.status(301).send(await this.courseService.getMessage())
      }
   }

   @Post("add/categories")
   async addCourseCategories(@Req() req:any , @Res() res:any ){
      const { categories , course } = req.body
      const code = req.code
      let cts:Array<number> = new Array()
      if( isArray( categories ) ){ 
            if( categories.length < 1 ){
               cts.push(1)
            }else{
               let cts_sort = categories.sort()
                  for( let i = 1; i <= cts_sort.length; i++ ){
                     if( cts_sort[ i - 1 ] != cts_sort[ i ] ){
                        cts.push( Number( cts_sort[i-1] ) )
                     }
                  }  
            }
            await this.courseService.CourseAddCategory(course, cts , code)
            if( await this.courseService.getMessage().status){
               res.status(201).send(await this.courseService.getMessage())
            }
            else{
               res.status(403).send(await this.courseService.getMessage())
            }
      }else{
         res.status(301).json({
            message:"Make sure categories are array type",
            status:false,
            tokenIsexpired:false
         })
      }
   }

   @Get("/admin/course")
   async adminFetching(@Req() req , @Res() res){

      const code = req.code   
      await this.courseService.adminGetCourse(code)
      if( await this.courseService.getMessage().status ){
         res.status(201).send( await this.courseService.getMessage() )
      }else{
         res.status(301).send( await this.courseService.getMessage() )
      }

   }

   @Post("create")
   async createCourse(@Req() req:any , @UploadedFile() file:any , @Res() res:any ){
      // const { access_token } = req.headers
      const code = req.code
      const { title , price , discount , discount_date , description , month , status , categories } = req.body

         const thumbnail = file.filename
         this.courseDTO = new CourseDTO()
         this.courseDTO.course_description = description
         this.courseDTO.course_price = price
         this.courseDTO.course_discount = discount
         this.courseDTO.course_discount_date = discount_date ? new Date( discount_date ) : new Date()
         this.courseDTO.course_month = month
         this.courseDTO.status = status
         this.courseDTO.course_title = title    
         this.courseDTO.course_thumbnail = thumbnail
         this.courseDTO.code = code
         if( isArray( categories ) ){
            let cts:Array<number> = new Array()
               if( categories.length < 1 ){
                  cts.push(1)
               }else{
                  let cts_sort = categories.sort()
                  for( let i = 1; i <= cts_sort.length; i++){
                     if( cts_sort[i -1] != cts_sort[i] ){ cts.push( Number(cts_sort[i-1]) ) }
                  }
               }
               await this.courseService.CreateCourse( this.courseDTO , cts, code )
               if( await this.courseService.getMessage().status ){
                  res.status(201).send(await this.courseService.getMessage())
               }else{
                  res.status(403).send(await this.courseService.getMessage())
               }
         }
         else{

            unlinkSync( join("src" , "pictures" , "thumbnails/"+file.filename ) ) 

            res.status(401).json({
               message:"Make sure categories are array type",
               status:false,
               tokenIsexpired:false
            })
         }
   
        

   }

   @Delete("delete")
   async DeleteCourse(@Req() req:any , @Res() res:any ){

      const { course } = req.body
      const code = req.code
      await this.courseService.CourseDelete( code , course )
      if( await this.courseService.getMessage().status ){

         res.status( 201 ).send(await this.courseService.getMessage())

      }else{

         res.status(403).send(await this.courseService.getMessage())

      }

   }

   @Put("update/category")
   async CategoryUpdateCourse(@Req() req:any , @Res() res:any ){
      const {category , category_update , course} = req.body
      const code = req.code

      let cts:Array<number> = new Array()
      let cts_update:Array<number> = new Array()
      let cts_sort:Array<number> = category.sort()
      let cts_update_sort:Array<number> = category_update.sort()

      for( let i = 1; i <= cts_sort.length; i++ ){
         if( cts_sort[i-1] != cts_sort[i]){
            cts.push(cts_sort[i-1])
         }
      }
      for( let i = 1; i <= cts_update_sort.length; i++ ){
         if( cts_update_sort[i-1] != cts_update_sort[i]){
            cts_update.push(cts_update_sort[i-1])
         }
      }

         await this.courseService.CheckUpdateCategoryCoursePermission(code , course)
         const courseCheck = await this.courseService.getMessage()
         if( courseCheck.status ){
            await this.courseService.CourseCategoryUpdate( code , course , cts , cts_update )
            if( await this.courseService.getMessage().status ){
               res.status(201).send( await this.courseService.getMessage() )
            }else{
               res.status(403).send( await this.courseService.getMessage() )
            } 
         }
         else{
            res.status(404).send( await this.courseService.getMessage() )
         }

   }

   @Get(":code")
   async OnlyOneCourse(@Param("code") code : string  ){

      await this.courseService.CourseOnlyOne(code)
      if( await this.courseService.getMessage().status){
         return await this.courseService.getOnlyCourse()
      }else{
         return await this.courseService.getMessage()
      }
   }

   @Delete("delete/category")
   async CategoryDeleteCourse(@Req() req:any , @Res() res:any){

      const code = req.code
      const { categories , course } = req.body
      await this.courseService.CourseDeleteCategories( course, categories , code)
      if( await this.courseService.getMessage().status ){
         res.status(201).send(await this.courseService.getMessage())
      }
      else{
         res.status(403).send( await this.courseService.getMessage() )
      }

   }

   @Put("update/course")
   async updateCourse(@Req() req:any , @Res() res:any){
      const code = req.code
      const { course_id , title , description , status_id , discount , discount_date , price , month } = req.body

      await this.courseService.CourseUpdate( code , course_id , title , description , status_id , discount , discount_date , price , month )
      if( await this.courseService.getMessage().status ){
         res.status(201).send( await this.courseService.getMessage() )
      }
      else{
         res.status(401).send( await this.courseService.getMessage() )
      }

   }

   @Get("paginate/get")
   async coursePagination( @Req() req:any , @Res() res:any){

      let { limit , page } = req.query

      if( limit == null || limit == undefined || !Number(limit) || limit == 0 ){
         limit = 10
      }

      if( page == null || page == undefined || !Number(page) || page == 0 ){
         page = 1
      }

      try {

         await this.courseService.CourseSelectPagination( limit , page )
         if( await this.courseService.getMessage().status ){
            res.status(200).send( await this.courseService.getMessage() )
         }else{
            res.status(404).send( await this.courseService.getMessage() )
         }

      } catch (error) {
         res.status(403).send(error)
      }

   }

   @Put("update/status")
   async courseUpdateStatus(@Req() req:any , @Res() res:any){

      const code = req.code
      const { course , status } = req.body

      await this.courseService.CourseChangeStatus( code , course , status )
      // res.send( await this.courseService.getMessage() )
      if( await this.courseService.getMessage().status ){
         res.status(201).send( await this.courseService.getMessage() )
      }
      else{
         res.status(403).send( await this.courseService.getMessage())
      }

   }

   @Post("post/episode")
   async postEpisode(@Req() req , @Res() res , @UploadedFile() file ){

      const code = req.code
      const fl = file.filename
      const { episode , title , description , course_id , status_id } = req.body

         await this.courseService.UplaodEpisode( episode , title , description , course_id , status_id , fl , code )
         if( await this.courseService.getMessage().status ){
            res.status(201).send( this.courseService.getMessage() )
         }else{
            res.status(301).send( this.courseService.getMessage() )
         }

   }

   @Put("update/episode")
   async updateEpisode( @Req() req , @Res() res ){
      // code:string , title:string , description:string, episode_part:number ,episode_id:number , course_id:number
      const code = req.code
      const { title , description , episode_part , episode_id , course_id , status_id } = req.body
      await this.courseService.UpdateEpisode( code , title , description , episode_part , episode_id , course_id , status_id )
      if( await this.courseService.getMessage().status ){
         res.status(201).send( await this.courseService.getMessage() )
      }else{
         res.status(301).send( await this.courseService.getMessage() )
      }


   }

   @Get("get/episodes/:title")
   async getEpisode( @Req() req , @Res() res , @Param("title") title:string ){
      // const { course_title } = req.body
      await this.courseService.getEpisode(title)
      if( await this.courseService.getMessage().status ){
         res.status(201).send(await this.courseService.getMessage())
      }else{
         res.status(301).send(await this.courseService.getMessage())
      }

   }

   @Get("get/videos/:episode_id/:course_id/:token")
   async getVideo( @Req() req , @Res() res , @Param("episode_id") episode_id , @Param("course_id") course_id , @Param("token") token ){
      // res.send( await CheckTokenNoMiddleware( token ))
      const checkToken = await CheckTokenNoMiddleware( token ) 
      if( checkToken.status ){
         // return res.status(201).send( checkToken.data.code )
         await this.courseService.getVideos( checkToken.data.code , episode_id , course_id )
         if( await this.courseService.getMessage().status ){
            res.status(201).sendFile( 
               // "1685776167020-1z1QECMOCw.mp4",
               await this.courseService.getMessage().responses[0].episodes[0].episode_url,
               {
                  root:join("src/pictures/videos")
               }
             )
            // res.sendFile( express.static( join( __dirname , "src/pictures/videos/"+await this.courseService.getMessage().responses[0].episodes[0].episode_url ) ) ) 
            // res.status(201).send( await this.courseService.getMessage().responses[0].episodes[0].episode_url )
         }else{
            res.status(404).send( await this.courseService.getMessage() )
         }
      }else{
         return res.status(301).send( checkToken ) 
      }


   }

   @Get("group/episodes/:course_id")
   async GroupSelectEpisodes( @Req() req  ,@Res() res , @Param("course_id") course_id ){
      await this.courseService.groupSelectEpisodes( course_id )
      if( await this.courseService.getMessage().status ){
         res.status( 201 ).send(await this.courseService.getMessage())
      }else{
         res.status( 301 ).send(await this.courseService.getMessage())
      }
   }

   @Put( "update/thumbnail" )
   async updateThumbnail( @Req() req , @Res() res , @UploadedFile() file ){

      const code = req.code
      const { course_id } = req.body
      // res.send( code )
      await this.courseService.updateThumbnail( code , course_id , file.filename )
      if( await this.courseService.getMessage().status ){
         res.status(201).send( await this.courseService.getMessage() )
      }else{
         unlinkSync( join( "src" , "pictures" , "thumbnails/"+file.filename ) )
         res.status(301).send(await this.courseService.getMessage())
      }
   }

   @Get("popular/:limit")
   async getPopularCourse( @Req() req , @Res() res ){

      const limit = req.params.limit
      // res.send({limit:limit})
      await this.courseService.getPopularCourse( limit )
      res.send( await this.courseService.getMessage() )

   }
}
