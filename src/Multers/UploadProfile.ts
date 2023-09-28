import * as multer from "multer"
import * as path from "path"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb( null , path.join("src" , "pictures" , "profiles/") )
    },
    filename:(req, file, cb)=>{
        const data = Date.now()+"-" + file.originalname.split(".")[0] + path.extname( file.originalname)
        cb( null, data )
    },
})

const MediaStorage = multer.diskStorage({
    destination:( req , file , cb )=>{
        cb( null , path.join("src" , "pictures" , "medias/") )
    },
    filename:( req , file , cb )=>{
        let name = Date.now() + "-"+ file.originalname.split(".")[0] + path.extname( file.originalname )
        cb( null, name)
    }
})

const ThumbnailStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb( null , path.join("src" , "pictures" , "thumbnails/") )
    },
    filename:(req, file, cb)=>{
        const data = Date.now()+"-" + file.originalname.split(".")[0] + path.extname( file.originalname)
        cb( null, data )
    },
})

export const UploadProfile = multer({ storage:storage })
export const UploadMedia = multer({ storage : MediaStorage})
export const UploadThumbnail = multer({storage:ThumbnailStorage})
