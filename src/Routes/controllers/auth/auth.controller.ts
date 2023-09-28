/*
https://docs.nestjs.com/controllers#controllers
*/
import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  Req,
  Res,
  UseInterceptors,
  Param,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthDTO } from 'src/DTO/AuthDTO';
import { AuthService } from 'src/Routes/services/auth/auth.service';
import e, { Request, Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { verifyPassword } from 'src/bcrypt/bcrypt';
import { generateNewAccessToken, verifyToken } from 'src/JWT/jwt';

@Controller('api/v1/auth')
// @UseGuards(RateLimiterGuard)
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('signupwithoutphoto')
  async RegisterWithEmailPasswordWithoutPhoto(@Body() authdto: AuthDTO , @Res() res) {
    //code , username , firstname , lastname , password , email , phone , method_id , role_id
    await this.authservice.RegisterWithEmailPassword(
      authdto.username,
      authdto.firstname,
      authdto.lastname,
      authdto.password,
      authdto.email,
      authdto.phone,
      process.env.DEFAULT_PROFILE_URL,
    );
    if (await this.authservice.getMessage().status) {
      return res.status(201).send( await this.authservice.getMessage());
    } else {
      return res.status(301).send( await this.authservice.getMessage() );
    }
  }

  @Post('signupwithphoto')
  async RegisterWithEmailPasswordWithPhoto(
    @Body() authdto: AuthDTO,
    @UploadedFile() file: any,
  ) {
    // code , username , firstname , lastname , password , email , phone , method_id , role_id
    await this.authservice.RegisterWithEmailPassword(
      authdto.username,
      authdto.firstname,
      authdto.lastname,
      authdto.password,
      authdto.email,
      authdto.phone,
      process.env.PROFILE_URL + file.filename
    );
    if (await this.authservice.getMessage().status) {
      return await this.authservice.getMessage();
    } else {
      fs.unlinkSync(join('src', 'pictures', 'profiles/' + file.filename ));
      return await this.authservice.getMessage();
    }
  }

  @Post('signin')
  async userSingin(@Body() authdto: AuthDTO , @Res() res:Response ) {
    await this.authservice.userLogin(authdto);
    if( await this.authservice.getMessage().status ){
      // res.setHeader('Access-Control-Allow-Credentials', true); 
        res.cookie( "logined" , true , {
          // secure:true,
          // sameSite:"lax",
          maxAge:new Date().setDate(1)
        } )
        res.cookie( "code" , await this.authservice.getMessage().code , {
          // secure:true,
          // sameSite:"lax",
          path:"/",
          maxAge:new Date().setDate(1)
        } )
        res.cookie( "access_token" , await this.authservice.getMessage().token , {
          // secure:true,
          // sameSite:"lax",
          path:"/",
          maxAge:new Date().setDate(1)
        } )
        res.cookie( "refresh_token" , await this.authservice.getMessage().refresh_token , {
          // secure:true,
          // sameSite:"lax",
          path:"/",
          maxAge:new Date().setDate(1)
        } )
      if( await this.authservice.getMessage().role.toLocaleLowerCase() == "admin" ){
        res.cookie( "isAdmin" ,true , {
          // secure:true,
          // sameSite:"lax",
          path:"/",
          maxAge:new Date().setDate(1)
        } )
      }
      return res.status(201).send( await this.authservice.getMessage() )
    }
    else{
      return res.status(404).send( await this.authservice.getMessage() )
    }
  }

  @Post("signout")
  async userSignout(@Res() res:Response){

      res.cookie( "logined" , "" , {
        // secure:true,
        // sameSite:"lax",
        maxAge:new Date().setDate(-11)
      } )
      res.cookie( "code" , "" , {
        // secure:true,
        // sameSite:"lax",
        maxAge:new Date().setDate(-11)
      } )
      res.cookie( "access_token" , "", {
        // secure:true,
        // sameSite:"lax",
        maxAge:new Date().setDate(-11)
      } ) 
      res.cookie( "refresh_token" , "" , {
        // secure:true,
        // sameSite:"lax",
        maxAge:new Date().setDate(-11)
      } )
      res.cookie( "isAdmin" , "" , {
        // secure:true,
        // sameSite:"lax",
        maxAge:new Date().setDate(-11)
      } )
      res.json({
        message:"Signout"
      })
  } 

  @Get('users')
  async selectAllUsers() {
    await this.authservice.selectAllUsers();
    if (await this.authservice.getMessage().status) {
      return await this.authservice.getMessage();
    } else {
      return await this.authservice.getMessage();
    }
  }

  @Get('users/:code')
  async selectOnlyUser(@Param('code') code: string) {
    await this.authservice.selectOnlyUser(code);
    if (await this.authservice.getMessage().status) {
      return await this.authservice.getOnlyUser();
    } else {
      return await this.authservice.getMessage();
    }
  }

  @Get('user/profile')
  async selectUserProfile(@Req() req: any , @Res() res:any ) {
    const code = req.code;
        let authdto = new AuthDTO();
        authdto.code = code;
        await this.authservice.selectProfileuser( authdto );
        if( await this.authservice.getMessage().status ){
          res.status(201).send( await this.authservice.getMessage() )
        }else{
          res.status(404).send( await this.authservice.getMessage() )
        }

    }

  @Post("user/newtoken")
  async generateNewToken( @Req() req:any  , @Res() res:any){
    const code = req.code
    const token = await generateNewAccessToken( code )
    if( token.status ){
      res.status(201).send(token)
    }else{
      res.status(403).json({
        tokenIsexpired:false,
        state:false,
        message:"Refresh Token's expired",
        refreshtokenIsexpired:true,
      })
    }

  }

  @Put("/user/update")
  async userUpdate( @Req() req:any , @Res() res:any){
    const code = req.code
    const { firstname , lastname , phone  } = req.body

    if(firstname != "" && lastname != "" ){
        await this.authservice.updateUserFirstnameAndLastnameAndPhone( code , firstname, lastname , phone  )
        if( await this.authservice.getMessage().status ){
          res.status(201).send(await this.authservice.getMessage() )
        }else{
          res.status(401).send( await this.authservice.getMessage() )
        }
    }
    else{
      res.status(404).json({
        message:"something wrong!",
        tokenIsexpired:false,
      })
    }
      
  }

  @Get( "/converttoadmin/:email/:secrete" )
  async userToAdmin( @Req() req , @Res() res ){

    const { email ,secrete } = req.params
    await this.authservice.converttoadmin( email , secrete )
    if( await this.authservice.getMessage().status ){
      res.status(201).send(await this.authservice.getMessage())
    }else{
      res.status(404).send(await this.authservice.getMessage())
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    
    const { email , name , code ,  picture } = req.user
    await this.authservice.SignupWithAnother( code , picture , name , email , 2 )
    // if( await this.authservice.getMessage().status ){
        res.redirect(`${process.env.CLIENT_REFIRECT}signup/?message=${await this.authservice.getMessage().message}`)
    // }else{
    //   res.redirect(`${process.env.CLIENT_REFIRECT}?status=${await this.authservice.getMessage().status}&message=${await this.authservice.getMessage().message}`)
    // }
  }

  @Get("verify/:token")
  async verifyAccout( @Req() req , @Res() res:Response , @Param("token") token ){

    await this.authservice.verifyAccount( token )
    if( await this.authservice.getMessage().status ){
      // res.send( await this.authservice.getMessage() )
      res.redirect( process.env.CLIENT_REFIRECT + "signin?message="+ await this.authservice.getMessage().message+"&status="+ await this.authservice.getMessage().status)
    }else{
      // res.send( await this.authservice.getMessage() )
      res.redirect( process.env.CLIENT_REFIRECT + "/signin?message="+ await this.authservice.getMessage().message+"&status="+ await this.authservice.getMessage().status )
    }
  }

  @Post("request/new/verify")
  async requestVerifyAccount(@Req() req , @Res() res){
    const { email , password } = req.body
    await this.authservice.requestNewVerifyAccount( email , password )
    if( await this.authservice.getMessage().status ){
      res.status(201).send( await this.authservice.getMessage() )
    }else{
      res.status(401).send( await this.authservice.getMessage() )
    }



  }

}
