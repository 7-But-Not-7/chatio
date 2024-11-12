import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EmailName } from 'src/common/enums/email-name.enum';
import { EmailHelper } from 'src/common/utils/email.helper';

interface EmailData {
    to: string;
    subject: string;
    template: EmailName;
    data: {[key: string]: any};
}

@Injectable()
export class EmailService {
    constructor(@InjectQueue("email") private readonly emailQueue: Queue){}

        async sendEmail(data: EmailData){
            const html = await EmailHelper.getHtml(data.template, data.data)
            await this.emailQueue.add('sendEmail', { to: data.to, subject: data.subject, html });
        }
}
