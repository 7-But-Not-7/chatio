import { ChatInvitationStatus } from "src/common/enums/db.enum";

export class UpdateChatInvitationDto {
    status: ChatInvitationStatus;
}