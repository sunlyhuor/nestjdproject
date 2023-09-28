import { Req, Res } from "@nestjs/common"
import { unlinkSync } from "fs"
import { join } from "path"
import { filter } from "rxjs"
import * as path from "path"

export function CheckFile(req , res , next){
   
    if( !req.file ){
      res.status(404).json({
        message:"Please Inserted file before submited!",
        tokenIsexpired:false,
        refreshtoknIsexpired:false
      })
    }else{
      next()
    }

}

export function Filter( req , res , next ){

  if( path.extname(req.file.originalname) == ".png" || path.extname(req.file.originalname) == ".jpg"){
    next()
  }else{
    res.status(301).json({
      message:"File only image!",
      tokenIsexpired:false,
      refreshtoknIsexpired:false
    })
  }

}

export function CheckFiles(req , res , next){
  if( !req.files ){

    res.status(403).json({
      message:"Input files before submit!",
      status:false,
      tokenIsexpired:false
    })
  }else{
    next()
  }
}