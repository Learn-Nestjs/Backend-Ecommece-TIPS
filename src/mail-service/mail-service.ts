import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as EmailTemplate from "email-templates"
import { ISendMail } from './interfaces';
import * as jwt from 'jsonwebtoken'
@Injectable()
export class MailService {
    private readonly mailer: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    constructor(private readonly configService: ConfigService) {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        this.mailer = transporter;
    }

    async sendMailToVerifyEmail(data: ISendMail) {
        try {
            const key = this.configService.get<string>('SECRET_HASH')
            const token = jwt.sign({email: data.to}, key)
            const email = new EmailTemplate();
            const emailRender = await email
            .render(`${__dirname}/emails/mars/html`, {
              name: data.templateData.name,
              linkVerify: `${this.configService.get<string>('FE_HOST')}verify-email?token=${token}`
            })

            await this.mailer.sendMail({
                from: this.configService.get<string>('DEFAULT_MAIL_FROM'),
                to: data.to, 
                subject: "Verify Your Email",
                html: emailRender,
                attachments: data.attachments
            });

        } catch (error) {
            // log file not throw ra loi
            console.log("error :", error)
            // throw new BadRequestException("Send mail error")
        }

    }
}
