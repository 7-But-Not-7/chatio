import { IsNotEmpty, IsString, Length } from "class-validator";

export class CodeDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 4)
    code: string;
}