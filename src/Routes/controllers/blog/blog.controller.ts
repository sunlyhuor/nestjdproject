/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post , Get , Put , Delete , Res , Req, UploadedFile , Query } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { BlogDTO } from 'src/DTO/BlogDTO';
import { BlogService } from 'src/Routes/services/blog/blog.service';
import { isArray } from 'util';

@Controller("api/v1/blog")
export class BlogController {
    constructor( private blogService:BlogService ){}

    @Post("create")
    async BlogCreate( @Req() req:any , @Res() res:any , @UploadedFile() file:any ){
        const { title , content , status , categories } = req.body
        const code = req.code
        let blogdto = new BlogDTO()
        blogdto.title = title
        blogdto.content = content
        blogdto.thumbnail = file.filename
        blogdto.status = status
        let cts:Array<number> = new Array<number>
        
        if( isArray( categories ) ){
            if( categories.length < 1 ) cts.push(1)
            else{
                let cts_sort = categories.sort()
                for( let i = 1; i <= cts_sort.length; i++ ){
                    if( cts_sort[i-1] != cts_sort[i] ) cts.push( Number( cts_sort[i-1] ) )
                }
            }

                blogdto.categories = cts
                await this.blogService.CreateBlog( code , blogdto )
                if( await this.blogService.getMessage().status ){
                    res.status(201).send( await this.blogService.getMessage() )
                }
                else{
                    unlinkSync( join("src" , "pictures" , "thumbnails/"+file.filename) )
                    res.status(401).send( await this.blogService.getMessage() )
                }


        }else{
            res.status(401).json({
                message:"Make sure categories are array type",
                status:false,
                tokenIsexpired:false
            })
        }
    }

    @Delete("delete")
    async BlogDelete( @Req() req:any , @Res() res:any ){

        const { blog } = req.body
        const code = req.code
        let cts:Array<number> = new Array<number>


            await this.blogService.DeleteBlog( code , blog )
            if( await this.blogService.getMessage().status ){
                res.status(201).send( await this.blogService.getMessage() )
            }
            else{
                res.status(401).send( await this.blogService.getMessage() )
            }

    }

    @Post("add/categories")
    async BlogAddCategories(@Req() req:any , @Res() res:any){
        const { blog , categories } = req.body
        const code = req.code
        let cts:Array<number> = new Array<number>
        let category;
        if( isArray( categories ) ){
            category = categories.sort()
            if( categories.length < 1 ){
                cts.push(1)
            }else{
                for( let i = 1; i <= categories.sort().length ; i++ ){
                    if( category[i-1] != category[i] ){
                        cts.push( category[i-1] )
                    }
                }
            }

            await this.blogService.AddCategories( code , blog , cts )
            if( await this.blogService.getMessage().status ){
                res.status(201).send( await this.blogService.getMessage() )
            }else{
                res.status(401).send( await this.blogService.getMessage() )
            }

        }
        else{
            res.status(403).json({
                meessage:"Make sure your categories are array type!",
                status:false,
                tokenIsexpired:false
            })
        }


    }

    @Delete("delete/categories")
    async BlogDeleteCategories( @Req() req:any , @Res() res:any ){
        const { blog , categories } = req.body
        const code = req.code

        let cts:Array<number> = new Array<number>
        if( isArray( categories ) ){
            if( categories.length < 1 ){ cts.push(1) }
            else{
                let cts_sort = categories.sort()
                for( let i =1; i <= cts_sort.length; i++ ){
                    if( cts_sort[i-1] != cts_sort[i]  ){ cts.push( Number(cts_sort[i-1]) ) }
                }
                await this.blogService.DeleteCategories( code , blog , cts )
                if( await this.blogService.getMessage().status ){
                    res.status(201).send( await this.blogService.getMessage() )
                }
                else{
                    res.status(403).send( await this.blogService.getMessage() )
                }
            }
        }
        else{
            res.status(301).json({
                message:"Make sure categories are array type",
                status:false,
                tokenIsexpired:false
            })
        }


    }

    @Put("update/categories")
    async UpdateCategories(@Req() req:any , @Res() res:any){

        const code = req.code
        const { blog , categories , update_categories } = req.body
        let cts:Array<number> = new Array()
        let cts_update:Array<number> = new Array()

        if( !isArray(categories) ){
            res.status(404).json({
                message:"Make sure categories are array type",
                status:false,
                tokenIsexpired:false
            })
        }
        else if( !isArray( update_categories ) ){
            res.status(404).json({
                message:"Make sure categories are array type",
                status:false,
                tokenIsexpired:false
            })
        }else{
            if( categories.length < 1 || update_categories.length < 1 ){
                res.status(401).json({
                    message:"Make sure categories and update_categories are not null or empty",
                    status:false,
                    tokenIsexpired:false
                })
            }else{

                let cts_sort = categories.sort()
                let cts_update_sort = update_categories.sort()
                for( let i = 1; i <= cts_sort.length; i++ ){ 
                    if( cts_sort[ i -1 ] != cts_sort[ i ] ){
                        cts.push( Number( cts_sort[ i - 1 ] ) )
                    }
                }
                for( let i = 1; i <= cts_update_sort.length; i++ ){ 
                    if( cts_update_sort[ i -1 ] != cts_update_sort[ i ] ){
                        cts_update.push( Number( cts_update_sort[ i - 1 ] ) )
                    }
                }
                
                await this.blogService.UpdateCategories( code , blog , cts , cts_update )
                if( await this.blogService.getMessage().status ){
                    res.status(201).json({
                        message:"Updated successfully!",
                        status:true,
                        tokenIsexpired:false
                    })
                }
                else{
                    res.status(404).send( await this.blogService.getMessage() )
                }

            }

        }

    }

    @Get()
    async getAllCourse( @Req() req , @Res() res , @Query( "limit" ) limit:number , @Query( "page" ) page:number ){
        // res.json({query : Number(limit) })
        await this.blogService.getAllblog( limit , page )
        if(await this.blogService.getMessage().status){
            res.status(200).send( await this.blogService.getMessage() )
        }else{
            res.status(404).send( await this.blogService.getMessage() )
        }

    }

    @Get( ":code" )
    async getCourseByTitle( @Req() req , @Res() res ){
        const { code } = req.params
        await this.blogService.getByTitle( code )
        if(await this.blogService.getMessage().status){
            res.status(201).send(await this.blogService.getMessage())
        }else{
            res.status(403).send(await this.blogService.getMessage())
        }
    }

    @Get( "/byid/:id" )
    async getCourseById( @Req() req , @Res() res ){
        const { id } = req.params
        await this.blogService.getById( id )
        if(await this.blogService.getMessage().status){
            res.status(201).send(await this.blogService.getMessage())
        }else{
            res.status(403).send(await this.blogService.getMessage())
        }
    }

    @Put("update")
    async updateBlog( @Req() req , @Res() res ){

        const code = req.code
        const { content , title , status_id , blog_id } = req.body
        await this.blogService.updateBlog( code , title , content , status_id , blog_id )
        if( await this.blogService.getMessage().status ){
            res.status(201).send( await this.blogService.getMessage() )   
        }else{
            res.status(301).send( await this.blogService.getMessage() )   
        }

    }

    @Get( "admin/blog" )
    async adminGetAllCourse( @Req() req , @Res() res ){

        const code = req.code
        await this.blogService.getAllblogByAdmin(code)
        if( await this.blogService.getMessage().status ){  
            res.status(201).send( await this.blogService.getMessage() )
        }else{
            res.status(301).send( await this.blogService.getMessage() )
        }

    }

}
