import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EmailName } from 'src/common/enums/email-name.enum';
import { EmailJob } from 'src/common/types/notification';
import { EmailHelper } from 'src/common/utils/email.helper';



@Injectable()
export class EmailService {
    constructor(){}

        async sendEmail(data: EmailJob){
            console.log("Sending email", data);
        }
}
