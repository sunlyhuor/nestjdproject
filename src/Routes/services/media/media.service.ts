import { Injectable } from "@nestjs/common"
import { AuthService } from "../auth/auth.service"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { MediaEntity } from "src/Entities/MediaEntity"
import { AuthEntity } from "src/Entities/AuthEntity"
import { MethodEntity } from "src/Entities/MethodEntity"
import { RoleEntity } from "src/Entities/RoleEntity"
import { StatusEntity } from "src/Entities/StatusEntity"
import { unlinkSync } from "fs"
import { join } from "path"
import { MessageType } from "src/components/MessageType"

// type messageType = {
//     message:string,
//     status:boolean,
//     responses?:Array<any>,
//     erorr?:any
// }

@Injectable()
export class MediaService {
    private media:Array<any>
    private message:MessageType
    private auth_entity:AuthEntity = new AuthEntity()
    private authservice:AuthService
    constructor(
         @InjectRepository(MediaEntity) private mediaRepository:Repository<MediaEntity>,
         @InjectRepository(AuthEntity) private authRepository:Repository<AuthEntity>,
         @InjectRepository(MethodEntity) private methodRepository:Repository<MethodEntity>,
         @InjectRepository(RoleEntity) private roleRepository:Repository<RoleEntity>,
         @InjectRepository(StatusEntity) private statusRepository:Repository<StatusEntity>
     ){
        this.authservice = new AuthService(authRepository , methodRepository , roleRepository , statusRepository)
     }

    // Getter And Setter
        public getMedia():Array<any>{
            return this.media
        }
        public setMedia(media:Array<any>):void{
            this.media = media
        }
    // End of Getter and Setter
    
    //Handle Function
        public setMessage(message:MessageType){
            this.message = message
        }

        public getMessage():MessageType{
            return this.message
        }

        public async MediaInsert( id:number ,media:string):Promise<void>{
            try {
                    this.auth_entity.auth_id = id
                    this.mediaRepository.insert({
                        media_name:process.env.DEFAULT_MEDIA_URL + "/" + media,
                        auth:this.auth_entity
                    })
                this.setMessage({message:"Inserted Successfully!" , status:true , tokenIsexpired:false})
            } catch (error) {
                this.setMessage({message:"Inserted Failed!" , status:false , tokenIsexpired:false})
            }
        }

        public async MediaDelete( code:string , photos:string):Promise<void>{
            await this.authservice.CheckAuth(code,"Admin")
            if( await this.authservice.getAuth() ){
                try{

                    const data = await this.mediaRepository.find({
                        where:{
                            media_name:photos
                        }
                    })
                    if(data.length > 0){

                        await this.mediaRepository.delete(
                            {
                                media_name:photos
                            }
                        )

                        const pt_array = data[0].media_name.split("/") 
                        const pt = pt_array[ pt_array.length - 1 ]
                        unlinkSync( join("src" , "pictures" , "medias/"+pt) )

                        this.setMessage( { message:"Deleted successfully!" , status:true , tokenIsexpired:false } )

                    }else{
                        this.setMessage( {message:"Please select other photo!" , status:false , tokenIsexpired:false} )
                    }

                }
                catch(erorr){
                    this.setMessage( { message:"Deleted failed!" , status:false , tokenIsexpired:false , error:erorr } )
                }
            }
            else{
                this.setMessage( { message:"Not Allow" , status:false , tokenIsexpired:false } )
            }
        }

        public async MediaSelect():Promise<void>{
            try{

                let photos = await this.mediaRepository.find({})

                if( photos.length > 0){
                    this.setMedia(photos)
                    this.setMessage({message:"Select successfully!" , status:true , responses: this.getMedia() })
                }else{
                    this.setMessage({message:"No media!" , status:true})
                }


            }catch(e){
                this.setMessage({message:"Selected failed!" , status:false})
            }
        }

    //End of Handle Function
    

}
