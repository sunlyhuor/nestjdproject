/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MailerController } from 'src/Mailer/mailer.controller';
import { MailerService } from 'src/Mailer/mailer.service';

@Module({
    imports: [],
    controllers: [MailerController],
    providers: [ MailerService ],
})
export class TestModule {}
