import { Injectable } from "@nestjs/common";
import { MessageProvider } from "../providers/message.provider";
import { CreateMessageDto } from "../dto/create-message.dto";
import { ChatGateway } from "../chat.gateway";


@Injectable()
export class MessagesService {
    constructor(
        private readonly messageProvider: MessageProvider,
        private readonly chatGateway: ChatGateway
    ) {}

    async getChatRoomMessages(chatRoomId: string) {
        const messages = await this.messageProvider.getMessagesByChatRoomId(chatRoomId);
        return messages;
    }

    async sendMessage(message: CreateMessageDto) {
        const createdMessage = await this.messageProvider.createMessage(message);
        
    }
}