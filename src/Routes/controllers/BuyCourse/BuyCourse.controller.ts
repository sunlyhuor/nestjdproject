import { Controller, Get , Post , Req , Res , Put, Delete, Param } from '@nestjs/common';
import { BuyCourseService } from 'src/Routes/services/BuyCourse/BuyCourse.service';
import { components } from 'src/components/components';

@Controller("api/v1/buycourse")
export class BuyCourseController {

  constructor(private service: BuyCourseService) { }

  @Post("/buy")
  async BuyCourse( @Req() req , @Res() res ){

    const code = req.code;
    const { course_id , payment_id , payment_tid } = req.body


    await this.service.BuyCourse( course_id , payment_id , payment_tid , code )

    if( await this.service.getMessage().status ){
      res.status(201).send( await this.service.getMessage() )        
    }else{
      res.status(301).send( await this.service.getMessage() )        
    }

  }

  @Get()
  async FetchBuyCourse(@Req() req , @Res() res){

    const code = req.code
    await this.service.GetAllBuyCourse(code)
    if(await this.service.getMessage().status){
      res.status(200).send( await this.service.getMessage() )
    }
    else{
      res.status(301).send( await this.service.getMessage() )
    }

  }

  @Put("edit-status")
  async EditStatus( @Req() req , @Res() res){
    const code = req.code
    const { buy_id , status_id } = req.body
    await this.service.EditStatus( code , buy_id , status_id )
    if(await this.service.getMessage().status){
      res.status(201).send(await this.service.getMessage())
    }else{
      res.status(301).send(await this.service.getMessage())
    }
  }

  @Put("edit-tid")
  async EditTID( @Req() req , @Res() res ){
    const code = req.code
    const { buy_course_id , tid } = req.body
    await this.service.EditTID( code , tid , buy_course_id )
    if( await this.service.getMessage().status ){
      res.status(201).send(await this.service.getMessage())
    }else{
      res.status(301).send(await this.service.getMessage())
    }

  }

  @Get("/mycart")
  async MyCart( @Req() req , @Res() res ){

    const code = req.code
    await this.service.GetMyCart( code )
    if( await this.service.getMessage().status ){
      res.status(200).send(await this.service.getMessage())
    }else{
      res.status(301).send(await this.service.getMessage())
    }

  }

  @Delete("delete")
  async DeleteCart(@Req() req , @Res() res ){
    const code = req.code
    const id = req.body.id
    await this.service.DeleteByID(id , code )
    if( await this.service.getMessage().status ){
        res.status(201).send( await this.service.getMessage() )
    }else{
        res.status(403).send( await this.service.getMessage() )
    }


  }


}
