import { PickType } from "@nestjs/mapped-types";
import { FcmToken } from "../entities/fcm-tokens.entity";


export class CreateFcmTokenDto extends PickType(FcmToken, ["token", "deviceId"]){
    userId: string;
}