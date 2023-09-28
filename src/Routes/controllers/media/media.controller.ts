import { Controller , Body , Req , Res , Post , Get, UploadedFiles, Delete }  from "@nestjs/common"
import { unlinkSync } from "fs"
import { join } from "path"
import { verifyToken } from "src/JWT/jwt"
import { AuthService } from "src/Routes/services/auth/auth.service"
import { MediaService } from "src/Routes/services/media/media.service"

@Controller("api/v1/media")
export class MediaController{
    constructor( private mediaservice:MediaService , private authservice:AuthService ){}

    @Post("upload")
    async MediaUpload( @Req() req:any , @UploadedFiles() files:any , @Res() res:any ){
        const code = req.code
        await this.authservice.CheckAuth( code , "Admin" )
        if( await this.authservice.getAuth()){
            await this.authservice.FindIdByCode( code )
            const id = await this.authservice.getCheckId()
            files.forEach( async e=>{
                await this.mediaservice.MediaInsert( id , e.filename )
            })
            res.status(201).send(await this.mediaservice.getMessage())
        }
        else{
            files.map((d)=>{
                unlinkSync( join( "src" , "pictures" , "medias/"+d.filename ) )
            })
            res.status(404).send( await this.authservice.getMessage() )
        }
    }
    
    @Get("photos")
    async MediaPhotos(@Req() req:any ){
        const { access_token } = req.headers
        // const token = await verifyToken( access_token )
        // if( token.status ){
            // await this.authservice.FindIdByCode(token.data.code)
            // if( await this.authservice.getMessage().status ){

                await this.mediaservice.MediaSelect()
                if( await this.mediaservice.getMessage().status ){
                    return this.mediaservice.getMessage()
                }
                else{
                    return await this.mediaservice.getMessage()
                }
                

            // }   
            // else{
            //     return await this.authservice.getMessage()
            // }



    }

    @Delete("delete")
    async MediaDelete(@Req() req:any , @Res() res:any ){
        const { photos } = req.body
        const code = req.code
        
        await this.mediaservice.MediaDelete( code , photos )
        if(await this.mediaservice.getMessage().status){
            res.status(201).send( await this.mediaservice.getMessage() )
        }else{
            res.status(301).send( await this.mediaservice.getMessage() )
        }
        
        
    }

}