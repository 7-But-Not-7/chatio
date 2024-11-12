// src/auth/dto/login.body.dto.ts
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional, ValidateNested, IsDefined, IsPhoneNumber } from 'class-validator';
import { IsEither } from 'src/common/decorators/isEither.decorator';
import { DeviceDto } from './device.data.dto';

export class LoginBodyDto {
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

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsDefined()
    @ValidateNested()
    @Type(() => DeviceDto)
    device: DeviceDto;
}