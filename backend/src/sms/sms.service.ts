import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SmsService {
    constructor(@InjectQueue("sms") private readonly smsQueue: Queue){}

    async sendSms(to: string, message: string){
        await this.smsQueue.add({ to, message });
    }
}
