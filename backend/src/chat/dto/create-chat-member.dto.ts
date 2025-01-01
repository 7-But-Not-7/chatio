import { ChatMemberRole } from "src/common/enums/db.enum";

export class CreateChatMemberDto {
    role?: ChatMemberRole;
    addedById?: string;
    userId: string;
    chatRoomId: string;
}