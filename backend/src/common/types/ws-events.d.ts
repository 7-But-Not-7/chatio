
export interface ServerChatEvents{
    message: (payload: any) => void;
}

export interface ClientChatEvents{
    message: (payload: any) => void;
}

export interface ServerNotificationEvents{
    notification: (payload: any) => void;
}