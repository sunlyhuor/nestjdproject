import { join } from "path"
import { Telegraf } from "telegraf"

export class components{
    // private bot:Telegraf = new Telegraf( process.env.TELEGRAM_TOKEN )
    public isExpired(expirationDate: Date): boolean {
        const now = new Date();
        return expirationDate.getTime() < now.getTime();
      }

      public sendMessageToChatBot(username:string){
        console.log( username )
        // this.bot.telegram.sendMessage( process.env.TELEGRAM_REPLY_ID , `${username} is registed today!( ${ new Date() } )` )  
      }

      public sendMessageToChatBotInvoice(){
        console.log( "Check carts for comfirm approve!" )
        // this.bot.telegram.sendMessage( process.env.TELEGRAM_REPLY_ID , `Check carts for comfirm approve! (${new Date()}) ` )
      }

      public sendMessageAfterUpdateTID( buy_course_id:number ){
        console.log( buy_course_id )
        // this.bot.telegram.sendMessage( process.env.TELEGRAM_REPLY_ID , `Have someone chage TID please check buy ID : ${buy_course_id} ! (${new Date()}) ` )
      }


}