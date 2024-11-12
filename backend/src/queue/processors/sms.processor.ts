import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";


@Processor('sms')
export class SmsProcessor{

    @Process()
    async sendSms(job: Job){
        console.log('Sending sms', job);
    }
}