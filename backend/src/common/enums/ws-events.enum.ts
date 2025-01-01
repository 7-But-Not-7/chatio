export enum ChatListenEvents {
    MESSAGE = 'message',
    TYPING = 'typing',
    STOP_TYPING = 'stop_typing',
}

export enum ChatEmitEvents {
    MESSAGE = 'message',
    UPDATE_MESSAGE = 'update_message',
    DELETE_MESSAGE = 'delete_message',
    TYPING = 'typing',
    STOP_TYPING = 'stop_typing',
}

export enum NotificationListenEvents {
    NOTIFICATION = 'notification',
}

export enum NotificationEmitEvents {
    NOTIFICATION = 'notification',
}