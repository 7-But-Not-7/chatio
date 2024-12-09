import { IsDefined, IsString } from "class-validator";

export class DeviceDto{

    @IsDefined()
    @IsString()
    id: string;

    @IsDefined()
    @IsString()
    name: string;
}