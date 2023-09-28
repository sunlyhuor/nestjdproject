import { Controller, Get } from "@nestjs/common";
import { MailerService } from "./mailer.service";

@Controller("api/v1/test")
export class MailerController{

    constructor( private mailerservice:MailerService ){}

    // @Get("send")
    // async sendMail(){
    //      await this.mailerservice.sendEmail("jkhmer1111@gmail.com" , "Hello title" , "<h1>Hello conent</h1>" ) 
    //      return 'send'
    // }

}