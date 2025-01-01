import { ChatInvitationStatus } from "src/common/enums/db.enum";

export class UpdateInvitationDto {
    status: ChatInvitationStatus;
}