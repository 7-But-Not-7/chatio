import { TokenMessage } from "firebase-admin/lib/messaging/messaging-api";


export class NotificationHelper {
    static getNotificationPayload(notification: Notification["data"]): Omit<TokenMessage, "token"> {
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