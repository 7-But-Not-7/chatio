import { resolve } from "path";
import { EmailName } from "../enums/email-name.enum";
import ejs from "ejs";

export class EmailHelper{
    // Get the email template for emails with ejs
    static async getHtml(template: EmailName, data: {[key: string]: any}) : Promise<string>{
        try {
            const emailPath = resolve("views", "emails", `${template}.email.ejs`);
            // Render the email template with ejs
            const email = await ejs.renderFile(emailPath, data);
            return email;
        } catch (error) {
            throw new Error(`Error rendering email template: ${error.message}`);
        }
    }
}