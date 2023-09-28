/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CourseblogdetailService } from '../courseblogdetail/courseblogdetail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from 'src/Entities/BlogEntity';
import { MethodEntity } from 'src/Entities/MethodEntity';
import { StatusEntity } from 'src/Entities/StatusEntity';
import { CourseBlogCategoryDetailEntity } from 'src/Entities/CourseBlogCategoryDetailEntity';
import { RoleEntity } from 'src/Entities/RoleEntity';
import { CategoryEntity } from 'src/Entities/CategoryEntity';
import { AuthEntity } from 'src/Entities/AuthEntity';
import { MessageType } from 'src/components/MessageType';
import { BlogDTO } from 'src/DTO/BlogDTO';
import { unlinkSync } from 'fs';
import { join } from 'path';
import * as NodeCache from "node-cache"
import * as uuid from "uuid"

@Injectable()
export class BlogService {
    private authService: AuthService;
    private courseblogdetailsService: CourseblogdetailService;
    private message:MessageType
    private node_cache = new NodeCache()

    constructor(
        @InjectRepository(BlogEntity) private blogRepository:Repository<BlogEntity>,
        @InjectRepository(CourseBlogCategoryDetailEntity) private courseblogdetailRepository:Repository<CourseBlogCategoryDetailEntity>,
        @InjectRepository(StatusEntity) private statusRepository:Repository<StatusEntity>,
        @InjectRepository(MethodEntity) private methodRepository:Repository<MethodEntity>,
        @InjectRepository(RoleEntity) private roleRepository:Repository<RoleEntity>,
        @InjectRepository(CategoryEntity) private categoryRepository:Repository<CategoryEntity>,
        @InjectRepository(AuthEntity) private authRepository:Repository<AuthEntity>,
    ){
        this.authService = new AuthService(authRepository , methodRepository, roleRepository , statusRepository);
        this.courseblogdetailsService = new CourseblogdetailService(categoryRepository , courseblogdetailRepository)
    }

    // Getter and Setter 

        private generateCode():string{
            return (uuid.v4().toString())
        }

        public getMessage():MessageType{
            return this.message
        }
        public setMessage(message:MessageType){
            this.message = message
        }

    //End of getter and setter

    //Handle Functions`
        private async checkCode( code:string ):Promise<any>{

           try {
            const data = await this.blogRepository.find({
                where:{
                    blog_code:code
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

        private async insertBlog(blogdto:BlogDTO , blog_code:string){
            const blog = await this.blogRepository.insert({
                blog_title:blogdto.title,
                blog_content:blogdto.content,
                blog_thumbnail:process.env.DEFAULT_THUMBNAIL_URL+"/"+blogdto.thumbnail,
                status:{
                    status_id:blogdto.status
                },
                auth:{
                    auth_id:await this.authService.getCheckId()
                },
                blog_code:blog_code
            })

                if( blogdto.categories.length > 0 ){
                        blogdto.categories.forEach( async e=>{
                            this.courseblogdetailsService.BlogDetailCreate( e , blog.identifiers[0].blog_id )

                        } )
                }
                    this.node_cache.del("allblogs")
                    this.setMessage({message:"Blog created successfully!!" , status:true, tokenIsexpired:false})
        }

        public async CreateBlog( code:string , blogdto:BlogDTO ):Promise<void>{

            await this.authService.FindIdByCode( code )
            await this.authService.CheckAuth( code , "Admin" )
            if( await this.authService.getAuth() ){
                if( blogdto.title == null || blogdto.title == "" || blogdto.content == null || blogdto.content == "" || blogdto.categories.length < 1 ){
                    // unlinkSync( join( "src" , "pictures" , " thumbnails/"+blogdto.thumbnail ) )
                    this.setMessage({ message:"Please input fields required!" , status:false , tokenIsexpired:false })
                }else{

                        if( blogdto.title.length <= 200 ){
                            try {

                                if( !isNaN( blogdto.status ) || blogdto.status != null ){
                                    const st = await this.statusRepository.find({
                                        where:{
                                            status_id:Number( blogdto.status )
                                        }
                                    })
                                    if( st.length < 1 ){
                                        this.setMessage({ message:"Please select another status!" , status:false , tokenIsexpired:false })
                                    }else{
                                        let code = this.generateCode()
                                        if( await this.checkCode( code ) ){
                                            code = this.generateCode()
                                            await this.insertBlog( blogdto , code )
                                        }else{
                                            await this.insertBlog( blogdto , code )
                                        }
                                    }
                                }else{
                                    // unlinkSync( join( "src" , "pictures" , "thumbnails/"+blogdto.thumbnail ) )
                                    this.setMessage({message:"Please select status!!" , status:false, tokenIsexpired:false})
                                }

                                
    
                            } catch (error) {
                                // unlinkSync( join( "src" , "pictures" , "thumbnails/"+blogdto.thumbnail ) )
                                this.setMessage({message:"Blog created failed!" , status:false, tokenIsexpired:false , error:error})
                            }
                        }else{
                            // unlinkSync( join( "src" , "pictures" , "thumbnails/"+blogdto.thumbnail ) )
                            this.setMessage({message:"Title too much! title should less than 50char" , status:false, tokenIsexpired:false })
                        }


                }
            }else{
                // unlinkSync( join( "src" , "pictures" , "thumbnails/"+blogdto.thumbnail ) )
                this.setMessage({message:"Not allow create blog!" , status:false, tokenIsexpired:false})
            }

        }

        public async DeleteBlog(code:string , blog:number):Promise<void>{

            await this.authService.CheckAuth(code , "Admin")
            if( blog != null ){
                if( await this.authService.getAuth() ){

                        try {
                            await this.authService.FindIdByCode(code)

                                const data = await this.blogRepository.find({
                                    where:{
                                        auth:{
                                            auth_id:await this.authService.getCheckId()
                                        },
                                        blog_id:blog
                                    }
                                })

                                if( data.length < 1 ){
                                    this.setMessage({ message:"No blog you wanna delete!" , status:false , tokenIsexpired:false })
                                }
                                else{
                                    await this.blogRepository.delete({
                                        auth:{
                                            auth_id:await this.authService.getCheckId()
                                        },
                                        blog_id:blog
                                    })
                                    const image = data[0].blog_thumbnail.split("/")
                                    unlinkSync( join("src" , "pictures" , "thumbnails/"+image[image.length - 1] ) )
                                    this.node_cache.del("allblogs")
                                    this.setMessage({ message:"Deleted blog successfully!" , status:true , tokenIsexpired:false })
                                }

                        } catch (error) {
                            this.setMessage({ message:"Deleted blog failed!" , status:false , tokenIsexpired:false })
                        }
                }else{
                    this.setMessage({ message:"Not allow!" , status:false , tokenIsexpired:false })
                }
            }else{
                this.setMessage({message:"Please select blog you're wanna delete" , status:false , tokenIsexpired:false})
            }


        }

        public async AddCategories(code:string , blog:number , categories:Array<number>):Promise<void>{

            await this.authService.FindIdByCode( code )
            try{
                const data = await this.blogRepository.find({
                    where:{
                        auth:{
                            auth_id:await this.authService.getCheckId()
                        },
                        blog_id:blog
                    }
                })
                if( data.length > 0 ){

                    try {   
                        categories.forEach( async e=>{
                            await this.courseblogdetailsService.BlogAddCategory( await this.authService.getCheckId() , blog , e )
                        } )
                        this.setMessage( { message:"Added categories successfully" , status:true , tokenIsexpired:false } )
        
                    } catch (error) {
                        this.setMessage( { message:"Added categories failed" , status:false , tokenIsexpired:false } )
                    }
        

                }
                else{
                    this.setMessage( { message:"Not allow" , status:false , tokenIsexpired:false } )
                }
            }
            catch(error){
                this.setMessage( { message:"Not allow" , status:false , tokenIsexpired:false } )
            }

        }

        public async DeleteCategories( code:string , blog:number , categories:Array<number> ):Promise<void>{

            try{
                        await this.authService.FindIdByCode( code )
                        const data = await this.blogRepository.find({
                            where:{
                                blog_id:blog,
                                auth:{
                                    auth_id:await this.authService.getCheckId()
                                }
                            }
                        })
                        if( data.length > 0 ){
                            categories.forEach( async e=>{
                                await this.courseblogdetailsService.BlogDeleteCategories( await this.authService.getCheckId() , blog , e )
                            } )
                            if( await this.courseblogdetailsService.getMessage().status ){
                                this.setMessage({message:"Deleted successfully" , status:true , tokenIsexpired:false})
                            }else{
                                this.setMessage({message:"Deleted failed" , status:false , tokenIsexpired:false})
                            }
                        }
                        else{
                            this.setMessage({message:"Not allow" , status:false , tokenIsexpired:false})
                        }

            }
            catch(error){
                this.setMessage({message:"Not allow" , status:false , tokenIsexpired:false, error:error })
            }

        }

        public async UpdateCategories( code:string , blog:number , categories:Array<number> , update:Array<number> ):Promise<void>{


            try{

                await this.authService.FindIdByCode(code)

                const data = await this.blogRepository.find({

                    where:{

                        blog_id:blog,
                        auth:{
                            auth_id:await this.authService.getCheckId()
                        }

                    }

                })

                if( data.length > 0 ){
                    for( let i = 0; i < categories.length; i++){

                        await this.courseblogdetailsService.BlogUpdateCategories( await this.authService.getCheckId() , blog , categories[i] , update[i] )
                        if( await this.courseblogdetailsService.getMessage().status ){
                            this.setMessage({message:"Updated successfully!" , status:true , tokenIsexpired:false})
                        }else{
                            this.setMessage({message:"Updated failed!" , status:false , tokenIsexpired:false})
                        }
                    }
                    this.setMessage({ message:"Updated successfully" , status:true , tokenIsexpired:false })
                }else{
                    this.setMessage({ message:"Not allow" , status:false , tokenIsexpired:false })
                }

            }
            catch(error){
                this.setMessage({ message:"Updated failed" , status:false , tokenIsexpired:false})
            }
            

        }

        public async getAllblog( limit:number , page:number ) : Promise<void> {

            try{
                let datas:any;
                // if( !this.node_cache.get("allblogs") ){
                    if( isNaN(limit) || Number(limit) < 1 ){
                        datas = await this.blogRepository.find({
                            where:{
                                status:{
                                    status_id:2
                                }
                            },
                            select:{
                                blog_title:true,
                                blog_content:true,
                                blog_id:true,
                                blog_createat:true,
                                blog_thumbnail:true,
                                categories:true,
                                blog_code:true,
                                auth:{
                                    auth_firstname:true,
                                    auth_lastname:true
                                }
                            },
                            relations:{
                                categories:{
                                    category:true
                                },
                                auth:true
                            },
                            order:{
                                blog_id:"DESC"
                            },
                            skip:0

                        })
                        // this.node_cache.set( "allblogs" , datas , 60*60 )
                    }else{
                        datas = await this.blogRepository.find({
                            where:{
                                status:{
                                    status_id:2
                                }
                            },
                            select:{
                                blog_title:true,
                                blog_content:true,
                                blog_id:true,
                                blog_createat:true,
                                blog_thumbnail:true,
                                categories:true,
                                blog_code:true,
                                auth:{
                                    auth_firstname:true,
                                    auth_lastname:true
                                }
                            },
                            relations:{
                                categories:{
                                    category:true
                                },
                                auth:true
                            },
                            order:{
                                blog_createat:"DESC"
                            },
                            skip: isNaN( page ) ? 0 : (Number(page) - 1) * Number(limit) ,
                            take:Number(limit)

                        })
                        // this.node_cache.set( "allblogs" , datas , 60*60 )
                    }
                // }else{
                //     datas = this.node_cache.get("allblogs")
                // }
                // if( datas.length < 1 ){
                    // this.setMessage({message:"No blog" , status:true , responses:[] , tokenIsexpired:false})
                // }else{
                this.setMessage({message:"Responsed" , status:true , tokenIsexpired:false , responses:datas })
                // }

            }catch(err){
                this.setMessage({message:"Fetching error" , status:false , tokenIsexpired:false , error:err})
            }

        }

        public async getByTitle(code:string){
            try{

                let datas
                if( !this.node_cache.get("signleblog") ){
                    datas = await this.blogRepository.find({
                        where:{
                            blog_code:code
                        },
                        relations:{
                            auth:true
                        },
                        select:{
                            auth:{
                                auth_username:true
                            }
                        }
                    })
                    this.node_cache.set("signleblog" , datas , 60*60 )
                }else{
                    datas = this.node_cache.get("signleblog")
                }

                if(datas.length < 1){
                    this.setMessage({message:"Blog not found" , status:false , tokenIsexpired:false })
                }
                else{
                    this.setMessage({message:"Blog found" , status:true , tokenIsexpired:false , responses: datas})
                }

            }catch(er){
                this.setMessage({message:"Fteched error" , status:false , tokenIsexpired:false , error:er})
            }
        }

        public async getById(id:number){
            try{

                if( !isNaN(id) || id != null ){
                
                    const datas = await this.blogRepository.find({
                        where:{
                            blog_id:Number(id)
                        },
                        relations:{
                            auth:true,
                            status:true
                        },
                        select:{
                            auth:{
                                auth_username:true
                            },
                            status:{
                                status_id:true,
                                status_name:true
                            }
                        }
                    })

                    if(datas.length < 1){
                        this.setMessage({message:"Blog not found" , status:false , tokenIsexpired:false })
                    }
                    else{
                        this.setMessage({message:"Blog found" , status:true , tokenIsexpired:false , responses: datas})
                    }
                }else{
                    this.setMessage({message:"Params must number" , status:false , tokenIsexpired:false })
                }

            }catch(er){
                this.setMessage({message:"Fteched error" , status:false , tokenIsexpired:false , error:er})
            }
        }

        public async updateBlog( code:string , title:string , content:string , status_id:number , blog_id:number ){

            try {
                await this.authService.CheckAuth(code , "Admin")
                if( this.authService.getAuth() ){

                    if( title == "" || title == null || content == "" || content == null || status_id == null ){
                        this.setMessage( { message:"Please input all fields required!" , status:false } )
                    }else{

                        if( title.length > 200 ){
                            this.setMessage( { message:"The title field must less than 100!" , status:false } )
                        }else{

                            const st = await this.statusRepository.find({
                                where:{
                                    status_id:Number( status_id )
                                }
                            })

                            if( st.length < 1 ){
                                this.setMessage( { message:"Please select another status!" , status:false } )
                            }else{

                                const bg = await this.blogRepository.find({
                                    where:{
                                        blog_id:Number(blog_id)
                                    }
                                })

                                if( bg.length < 1 ){
                                    this.setMessage( { message:"Please select another blog!" , status:false } )
                                }else{

                                    this.blogRepository.update(
                                        {
                                            blog_id:Number(blog_id)
                                        },
                                        {
                                            blog_content:content,
                                            blog_title:title,
                                            status:{
                                                status_id:Number(status_id)
                                            }
                                        }
                                    )

                                    this.setMessage( { message:"Updated successfully!" , status:true } )

                                }

                            }

                        }

                    }

                }else{
                    this.setMessage({ message:"Not allow" , status:false })
                }
                // if( title == "" || content == "" ){

                // }


            } catch (error) {
                this.setMessage({ message:"Updated failed" , status:false , error:error })
            }

        }

        public async getAllblogByAdmin( code:string ) : Promise<void> {

            try{
                await this.authService.CheckAuth(code , "Admin")

                if( await this.authService.getAuth() ){
                    const datas = await this.blogRepository.find({
                        select:{
                            // blog_title:true,
                            // blog_content:true,
                            // blog_id:true,
                            // blog_createat:true,
                            // blog_thumbnail:true,
                            // categories:true,
                            auth:{
                                auth_firstname:true,
                                auth_lastname:true
                            },
                            status:{
                                status_id:true,
                                status_name:true
                            },
                            categories:{
                                category:{
                                    category_id:true,
                                    category_name:true
                                }
                            }
                        },
                        relations:{
                            categories:{
                                category:true
                            },
                            auth:true,
                            status:true
                        },
                        order:{
                            blog_createat:"DESC"
                        }
                    })
    
                    if( datas.length < 1 ){
                        this.setMessage({message:"No blog" , status:false , tokenIsexpired:false})
                    }else{
                        this.setMessage({message:"Responsed" , status:true , tokenIsexpired:false , responses:datas })
                    }
                }else{
                    this.setMessage({message:"Not allow" , status:false , tokenIsexpired:false })
                }

            }catch(err){
                this.setMessage({message:"Fetching error" , status:false , tokenIsexpired:false , error:err})
            }

        }
    //End of Handle Functions


}
