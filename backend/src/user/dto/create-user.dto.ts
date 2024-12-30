import { User } from "../entities/user.entity";
import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateUserDto extends OmitType(User, [
    'id',
    'createdAt',
    'updatedAt',
    'settings',
    'createdChatRooms',
    'chatMembers',
    'notifications',
    'invitationsReceived',
    'invitationsSent',
    'blockedBy',
    'blocked',
]) { }
