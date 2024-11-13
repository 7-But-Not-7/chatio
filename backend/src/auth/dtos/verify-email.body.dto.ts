import { IsDefined, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { EmailDto } from "./email.body.dto";
import { IntersectionType } from "@nestjs/mapped-types";
import { CodeDto } from "./code.dto";


export class VerifyEmailDto extends IntersectionType(EmailDto, CodeDto) { }