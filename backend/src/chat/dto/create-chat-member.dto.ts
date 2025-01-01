import { ChatMemberRole } from "src/common/enums/db.enum";

export class CreateChatMemberDto {
    role?: ChatMemberRole;
    addedBy?: string;
    userId: string;
    chatRoomId: string;
}