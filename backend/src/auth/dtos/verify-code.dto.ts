import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyCodeDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 4)
    code: string;
}