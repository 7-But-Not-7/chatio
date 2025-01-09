import { ChatInvitationStatus } from "src/common/enums/db.enum";

export class CreateChatInvitationDto {
    chatRoomId: string;
    receiverId: string;
    isGroup?: boolean;
    senderId: string;
    status?: ChatInvitationStatus;
}