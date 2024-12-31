import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { EmailJob } from "src/common/types/notification";
import { EmailService } from "src/email/email.service";


@Processor('email')
export class EmailProcessor{
    constructor(private readonly emailService: EmailService){}

    @Process()
    async sendEmail(job: Job<EmailJob>){
        await this.emailService.sendEmail(job.data);
    }
}