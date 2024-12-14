import { IsDefined, IsEmail, IsString } from "class-validator";


export class EmailDto{
    @IsDefined()
    @IsString()
    @IsEmail()
    email: string;
}