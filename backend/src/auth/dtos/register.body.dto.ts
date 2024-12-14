import { IntersectionType } from "@nestjs/mapped-types";
import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { EmailDto } from "./email.body.dto";
import { PhoneDto } from "./phone.body.dto";
import { PasswordDto } from "./password.dto";

export class RegisterBodyDto extends IntersectionType(EmailDto, PhoneDto, PasswordDto){

    @IsOptional()
    @IsString()
    fullName?: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    username: string;
}