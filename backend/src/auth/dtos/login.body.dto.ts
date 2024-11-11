// src/auth/dto/login.body.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { IsEither } from 'src/common/decorators/isEither.decorator';

export class LoginBodyDto {
  @IsString()
  @IsOptional()
  @IsEmail()
  @IsEither('phoneNumber', { message: 'Either email or phoneNumber must be provided' })
  email?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEither('email', { message: 'Either email or phoneNumber must be provided' })
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}