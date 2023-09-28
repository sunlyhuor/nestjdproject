import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService{
    private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    });
  }

  async sendVerifiedToEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from:  process.env.MAILER_EMAIL,
        to,
        subject,
        text: content,
    });
    } catch (error) {
      console.log( error )
    }
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
      try {
        await this.transporter.sendMail({
          from:  process.env.MAILER_EMAIL,
          to,
          subject,
          text: content,
      });
      } catch (error) {
        console.log(error)
      }
  }
}