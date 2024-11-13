import { IntersectionType } from "@nestjs/mapped-types";
import { EmailorPhoneDto } from "./email-phone.opt.dto";
import { CodeDto } from "./code.dto";
import { PasswordDto } from "./password.dto";

export class ResetPasswordDto extends IntersectionType(EmailorPhoneDto, CodeDto, PasswordDto){}