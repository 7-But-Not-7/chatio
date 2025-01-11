import { TokenMessage } from "firebase-admin/lib/messaging/messaging-api";
import { NotificationJob } from "../types/notification";


export class NotificationHelper {
    static getNotificationPayload(notification: NotificationJob["data"]): Omit<TokenMessage, "token"> {
        return {
            notification: {
                title: notification.title,
                body: notification.content,
                imageUrl: notification.image,
            },
            webpush: {
                notification: {
                    icon: notification.image,
                    click_action: notification.actionURL,
                    vibrate: [200, 100, 200],
                }
            },
        };
    }
}

export class NotificationContentHelper {
    static getChatInvitationContent(senderName: string, chatName?: string): string {
        return chatName ? `You have received a chat invitation from ${senderName} for ${chatName}` : `You have received a chat invitation from ${senderName}`;
    }

    static getChatInvitationAcceptedContent(senderName: string, chatName?: string): string {
        return chatName ? `${senderName} has accepted your chat invitation for ${chatName}` : `${senderName} has accepted your chat invitation`;
    }

    static getChatInvitationRejectedContent(senderName: string, chatName?: string): string {
        return chatName ? `${senderName} has rejected your chat invitation for ${chatName}` : `${senderName} has rejected your chat invitation`;
    }
}

export class NotificationActionUrlHelper{
    static getChatInvitationActionURL(invitationId: string): string {
        return `/chat/invitations/${invitationId}`;
    }

    static getChatInvitationAcceptedActionURL(chatRoomId: string): string {
        return `/chat/rooms/${chatRoomId}`;
    }

    static getChatInvitationRejectedActionURL(): string {
        return `/chat/invitations`;
    }
}