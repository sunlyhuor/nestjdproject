import { Module } from "@nestjs/common";
import TelegramController from "src/Routes/controllers/telegram/telegram.controller";
import TelegramService from "src/Routes/services/telegram/telegram.service";

@Module({
    imports:[],
    providers:[ TelegramService ],
    controllers:[ TelegramController ]
})
export default class TelegramModule{

}