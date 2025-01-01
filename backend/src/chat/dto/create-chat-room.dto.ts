

export class CreateChatRoomDto {
    name?: string;
    description?: string;
    isGroup: boolean;
    members: string[];
}