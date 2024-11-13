// src/auth/dto/login.body.dto.ts
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional, ValidateNested, IsDefined, IsPhoneNumber } from 'class-validator';
import { IsEither } from 'src/common/decorators/isEither.decorator';
import { DeviceDto } from './device.data.dto';
import { EmailorPhoneDto } from './email-phone.opt.dto';

export class LoginBodyDto extends EmailorPhoneDto {
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsDefined()
    @ValidateNested()
    @Type(() => DeviceDto)
    device: DeviceDto;
}