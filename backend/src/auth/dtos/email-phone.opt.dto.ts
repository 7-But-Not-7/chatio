import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { IsEither } from "src/common/decorators/isEither.decorator";

export class EmailorPhoneDto {
    @IsString()
    @IsOptional()
    @IsEmail()
    @IsEither('phoneNumber', { message: 'Either email or phoneNumber must be provided' })
    email?: string;

    @IsString()
    @IsOptional()
    @IsPhoneNumber()
    @IsEither('email', { message: 'Either email or phoneNumber must be provided' })
    phoneNumber?: string;
}