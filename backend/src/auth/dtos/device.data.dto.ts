import { IsDefined, IsString } from "class-validator";

export class DeviceDto{

    @IsDefined()
    @IsString()
    name: string;
}