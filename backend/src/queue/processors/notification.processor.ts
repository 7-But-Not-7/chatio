import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";


@Processor('notification')
export class NotificationProcessor{

    @Process()
    async sendNotification(job: Job){
        console.log('Sending notification', job);
    }
}