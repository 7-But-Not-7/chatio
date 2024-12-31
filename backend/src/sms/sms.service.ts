import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SmsJob } from 'src/common/types/notification';

@Injectable()
export class SmsService {
    constructor(){}

    async sendSms(smsData: SmsJob){
        console.log("Sending sms", smsData);
    }
}
