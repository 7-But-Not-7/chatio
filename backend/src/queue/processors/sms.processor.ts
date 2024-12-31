import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { SmsJob } from "src/common/types/notification";
import { SmsService } from "src/sms/sms.service";


@Processor('sms')
export class SmsProcessor{
    constructor(private readonly smsService: SmsService){}

    @Process()
    async sendSms(job: Job<SmsJob>){
       await this.smsService.sendSms(job.data);
    }
}