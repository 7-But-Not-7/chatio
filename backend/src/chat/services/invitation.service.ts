import { BadRequestException, Injectable } from "@nestjs/common";
import { ChatInvitationProvider } from "../providers/chat-invitation.provider";
import { ErrorMessages } from "src/common/enums/error-messages.enum";
import { ChatInvitationStatus } from "src/common/enums/db.enum";

@Injectable()
export class InvitationService{
    constructor(
        private readonly chatInvitationProvider: ChatInvitationProvider,
    ){}

    async getReceivedInvitationsByUserId(userId: string){
        const invitations = await this.chatInvitationProvider.getReceivedChatInvitationsByUserId(userId);
        return invitations;
    }

    async getSentInvitationsByUserId(userId: string){
        const invitations = await this.chatInvitationProvider.getSentChatInvitationsByUserId(userId);
        return invitations;
    }

    async sendInvitation(senderId: string, receiverId: string, chatRoomId: string){
        const invitation = await this.chatInvitationProvider.createChatInvitation({chatRoomId, receiverId, senderId});
        return invitation;
    }

    async acceptInvitation(invitationId: string){
        const invitation = await this.chatInvitationProvider.getChatInvitationById(invitationId);
        if(!invitation){
            throw new BadRequestException(ErrorMessages.INVITATION_NOT_FOUND);
        }
        invitation.status = ChatInvitationStatus.ACCEPTED;
        const updatedInvitation = await this.chatInvitationProvider.updateChatInvitation(invitation);
        return updatedInvitation;
    }

    async rejectInvitation(invitationId: string){
        const invitation = await this.chatInvitationProvider.getChatInvitationById(invitationId);
        if(!invitation){
            throw new BadRequestException(ErrorMessages.INVITATION_NOT_FOUND);
        }
        invitation.status = ChatInvitationStatus.REJECTED;
        const updatedInvitation = await this.chatInvitationProvider.updateChatInvitation(invitation);
        return updatedInvitation;
    }

    async deleteInvitation(invitationId: string){
        const invitation = await this.chatInvitationProvider.getChatInvitationById(invitationId);
        if(!invitation){
            throw new BadRequestException(ErrorMessages.INVITATION_NOT_FOUND);
        }
        const deletedInvitation = await this.chatInvitationProvider.deleteChatInvitationById(invitationId);
        return deletedInvitation;
    }
}