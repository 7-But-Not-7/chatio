import { BadRequestException, Injectable } from "@nestjs/common";
import { ChatInvitationProvider } from "../providers/chat-invitation.provider";
import { ErrorMessages } from "src/common/enums/error-messages.enum";
import { ChatInvitationStatus } from "src/common/enums/db.enum";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { NotificationJob } from "src/common/types/notification";
import { NotificationImage, NotificationTitle, NotificationType } from "src/common/enums/notification.enum";
import { NotificationActionUrlHelper, NotificationContentHelper } from "src/common/utils/notification.helper";
import { ChatRoomProvider } from "../providers/chat-room.provider";
import { ChatRoom } from "../entities/chat-room.entity";

@Injectable()
export class InvitationService {
    constructor(
        private readonly chatInvitationProvider: ChatInvitationProvider,
        private readonly chatRoomProvider: ChatRoomProvider,
        @InjectQueue('notifications') private readonly notificationsQueue: Queue<NotificationJob>,
    ) { }

    

    async getReceivedInvitationsByUserId(userId: string) {
        const invitations = await this.chatInvitationProvider.getReceivedChatInvitationsByUserId(userId);
        return invitations;
    }

    async getSentInvitationsByUserId(userId: string) {
        const invitations = await this.chatInvitationProvider.getSentChatInvitationsByUserId(userId);
        return invitations;
    }

    async sendInvitation(senderId: string, receiverId: string, chatRoom: ChatRoom) {
        const invitation = await this.chatInvitationProvider.createChatInvitation({ chatRoomId: chatRoom.id, receiverId, senderId, isGroup: chatRoom.isGroup, status: ChatInvitationStatus.PENDING });
        this.notificationsQueue.add({
            to: receiverId,
            data: {
                title: NotificationTitle.CHAT_INVITATION,
                type: NotificationType.CHAT_INVITATION,
                content: chatRoom.isGroup ? NotificationContentHelper.getChatInvitationContent(senderId, chatRoom.name)
                    : NotificationContentHelper.getChatInvitationContent(senderId),
                actionURL: NotificationActionUrlHelper.getChatInvitationActionURL(invitation.id),
                image: NotificationImage.CHAT_INVITATION
            }
        })
        return invitation;
    }

    async acceptInvitation(invitationId: string) {
        const invitation = await this.chatInvitationProvider.getChatInvitationById(invitationId);
        if (!invitation) {
            throw new BadRequestException(ErrorMessages.INVITATION_NOT_FOUND);
        }
        invitation.status = ChatInvitationStatus.ACCEPTED;
        const updatedInvitation = await this.chatInvitationProvider.updateChatInvitation(invitation);

        return updatedInvitation;
    }

    async rejectInvitation(invitationId: string) {
        const invitation = await this.chatInvitationProvider.getChatInvitationById(invitationId);
        if (!invitation) {
            throw new BadRequestException(ErrorMessages.INVITATION_NOT_FOUND);
        }
        invitation.status = ChatInvitationStatus.REJECTED;
        const updatedInvitation = await this.chatInvitationProvider.updateChatInvitation(invitation);
        return updatedInvitation;
    }

    async deleteInvitation(invitationId: string) {
        const invitation = await this.chatInvitationProvider.getChatInvitationById(invitationId);
        if (!invitation) {
            throw new BadRequestException(ErrorMessages.INVITATION_NOT_FOUND);
        }
        const deletedInvitation = await this.chatInvitationProvider.deleteChatInvitationById(invitationId);
        return deletedInvitation;
    }
}