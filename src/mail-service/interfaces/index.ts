import { Options } from 'nodemailer/lib/mailer';

export interface ISendMail extends Options {
    token: string,
    templateData : {
        name: string
    }
}