import { Injectable } from "@nestjs/common";
import { MessageProvider } from "../providers/message.provider";
import { CreateMessageDto } from "../dto/create-message.dto";
import { ChatGateway } from "../chat.gateway";
import { PickType } from '@nestjs/mapped-types';
import { UpdateMessageDto } from "../dto/update-message.dto";


@Injectable()
export class MessagesService {
    constructor(
        private readonly messageProvider: MessageProvider,
        private readonly chatGateway: ChatGateway
    ) { }

    async getChatRoomMessages(chatRoomId: string) {
        const messages = await this.messageProvider.getMessagesByChatRoomId(chatRoomId);
        return messages;
    }

    async sendMessage(message: CreateMessageDto, userId: string) {
        const createdMessage = await this.messageProvider.createMessage(message);
        this.chatGateway.sendMessage(userId, message);
        return createdMessage;
    }

    async updateMessage(id: string, updateData: UpdateMessageDto) {
        const updatedMessage = await this.messageProvider.updateMessage(id, updateData);
        this.chatGateway.updateMessage(id, updatedMessage.chatRoom.id, updatedMessage);
        return updatedMessage;
    }

    async deleteMessage(messageId: string, userId: string) {
        const deletedMessage = await this.messageProvider.deleteMessageById(messageId);
        this.chatGateway.deleteMessage(userId, deletedMessage.chatRoom.id, messageId);
        return deletedMessage;
    }
}