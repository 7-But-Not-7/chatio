import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";


@Processor('email')
export class EmailProcessor{

    @Process()
    async sendEmail(job: Job){
        console.log('Sending email', job);
    }
}