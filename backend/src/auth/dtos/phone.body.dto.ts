import { IsDefined, IsPhoneNumber, IsString } from "class-validator";


export class PhoneDto{
    @IsDefined()
    @IsString()
    @IsPhoneNumber()
    phone: string;
}