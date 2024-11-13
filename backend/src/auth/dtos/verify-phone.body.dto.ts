import { PhoneDto } from "./phone.body.dto";
import { IntersectionType } from "@nestjs/mapped-types";
import { CodeDto } from "./code.dto";

export class VerifyPhoneDto extends IntersectionType(PhoneDto, CodeDto) { }