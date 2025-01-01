import { PartialType, PickType } from "@nestjs/mapped-types";
import { ChatMember } from "../entities/chat-member.entity";

export class UpdateChatMemberDto extends PartialType(PickType(ChatMember, ["role", 'isBanned', 'isMuted', 'deletedAt'])) {}