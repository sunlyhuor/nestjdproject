import { Injectable } from "@nestjs/common";
import { Telegraf  } from "telegraf"

@Injectable()
export default class TelegramService{
    private bot:Telegraf
    private chatID = process.env.TELEGRAM_REPLY_ID

    constructor(){
        this.bot = new Telegraf(process.env.TELEGRAM_TOKEN)

        this.bot.command("start" , async (ctx)=> {
            ctx.reply("Start message");
        } )


        this.bot.command('end' , (ctx)=>{
            ctx.reply("End message")
        })


            this.bot.launch()
    }

   public async SendMailAfterRegister( username:string ){

    try{

        await this.bot.telegram.sendMessage(this.chatID , username + " is registed today!" )

    }catch(e){
        console.log(e)
    }

   }

   public StopTelegram(){
    this.bot.stop()
   }

}