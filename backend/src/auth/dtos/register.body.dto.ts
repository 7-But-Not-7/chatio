import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class RegisterBodyDto {

    @IsOptional()
    @IsString()
    fullName: string;

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
    @IsNotEmpty()
    phoneNumber: string;
}