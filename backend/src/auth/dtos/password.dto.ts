import { IsDefined, IsString, IsStrongPassword } from "class-validator";

export class PasswordDto {
    @IsDefined()
    @IsString()
    @IsStrongPassword()
    password: string;
}