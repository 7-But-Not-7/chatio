import { SendEmailCommand, SendEmailCommandInput, SESClient } from "@aws-sdk/client-ses";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CompanyDetails } from "src/common/enums/company-details.enum";
import { EmailData } from "src/email/email.service";

interface EmailJobData extends Omit<EmailData, 'template' | 'data'> {
    html: string;
}

@Processor('email')
export class EmailProcessor {

    private readonly sesClient: SESClient;
    constructor() {
        this.sesClient = new SESClient({ region: 'us-east-1' });
    }

    @Process()
    async sendEmail(job: Job<EmailJobData>) {
        const { html, to, subject } = job.data;
        console.log({ html, to, subject });
        console.log(`Sending email to ${to} with subject ${subject}...`);
        const params: SendEmailCommandInput = {
            Source: CompanyDetails.SUPPORT_EMAIL,
            Destination: {
                ToAddresses: [to]
            },
            Message: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Html: {
                        Data: html
                    }
                }
            }
        }

        try {
            const command = new SendEmailCommand(params);
            const result = await this.sesClient.send(command);
            console.log(`Email sent to ${to}`, result);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error(`Error sending email: ${error.message}`);
        }
    }
}