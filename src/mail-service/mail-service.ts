import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
@Injectable()
export class MailService {

    constructor() {
         nodemailer.createTransport({
            host: "http://localhost",
            port: 465,
            secure: true,
            auth: {
                user: "main.reup@gmail.com",
                pass: "12042001@Dnc",
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
}
