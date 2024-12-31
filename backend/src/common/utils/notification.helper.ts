import { TokenMessage } from "firebase-admin/lib/messaging/messaging-api";


export class NotificationHelper {
    static getNotificationPayload(notification: Notification["data"]): Omit<TokenMessage, "token"> {
        return {
            notification: {
                title: notification.data.title,
                body: notification.data.content,
                imageUrl: notification.data.image,
            },
            webpush: {
                notification: {
                    icon: notification.data.image,
                    click_action: notification.data.actionURL,
                    vibrate: [200, 100, 200],
                }
            },
        };
    }
}