export interface ISendMail {
    mailTo: string;
    subject: string;
    html: string;
    attachment?: {
        filename : string;
        content: string | Buffer
    }
}