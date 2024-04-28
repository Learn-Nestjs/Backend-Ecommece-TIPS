import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Options } from 'nodemailer/lib/mailer';
import * as EmailTemplate from "email-templates"
import * as path from 'path'
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

    async sendMail(data: Options) {
        try {
            const email = new EmailTemplate();
            const emailRender = await email
            .render(`${__dirname}/emails/mars/html`, {
              name: 'Dncuong',
              linkVerify: "http://localhost:3000/verify-email"
            })
            await this.mailer.sendMail({
                from: this.configService.get<string>('DEFAULT_MAIL_FROM'),
                to: data.to, 
                subject: data.subject,
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
