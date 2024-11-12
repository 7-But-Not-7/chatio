import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class RegisterBodyDto {

    @IsOptional()
    @IsString()
    fullName?: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsDefined()
    @IsString()
    @IsStrongPassword()
    password: string;

    @IsDefined()
    @IsString()
    @IsEmail()
    email: string;

    @IsDefined()
    @IsString()
    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string;
}