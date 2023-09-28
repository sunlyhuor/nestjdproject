import { Controller, Get } from "@nestjs/common";
import TelegramService from "src/Routes/services/telegram/telegram.service";

@Controller("/api/v1/telegram")
export default class TelegramController{

    constructor(
        private telegramService:TelegramService
    ){}

}