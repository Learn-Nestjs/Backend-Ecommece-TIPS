import { Options } from 'nodemailer/lib/mailer';

export interface ISendMail extends Options {
    templateData : {
        name: string
    }
}