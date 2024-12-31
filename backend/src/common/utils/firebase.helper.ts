import { ConfigService } from "@nestjs/config";
import { AppEnum } from "../enums/app.enum";
import * as fs from 'fs';

export class FirebaseHelper {
    static getServiceAccountKey(configService: ConfigService) : string | object | undefined {
        // Check if file in path exists
        const serviceAccountPath = __dirname + AppEnum.FIREBASE_SERVICE_KEY_FILE;
        if(fs.existsSync(serviceAccountPath)) {
            return serviceAccountPath;
        }
        // Check if environment variable exists
        const serviceAccountKey = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_KEY');
        if(serviceAccountKey) {
            return JSON.parse(Buffer.from(serviceAccountKey, 'base64').toString("utf-8"));
        }
        return undefined;
    }
}