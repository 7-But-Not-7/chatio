import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatInvitation } from "../entities/chat-invitation.entity";
import { CreateChatInvitationDto } from "../dto/create-inivitation.dto";
import { UpdateChatInvitationDto } from "../dto/update-invitation.dto";


export class MessageProvider {
    constructor(@InjectRepository(ChatInvitation) private readonly chatInvitationRepository: Repository<ChatInvitation>) { }

    getReceivedChatInvitationsByUserId(userId: string): Promise<ChatInvitation[]> {
        return this.chatInvitationRepository.find({ where: { receiver: { id: userId } } });
    }

    getSentChatInvitationsByUserId(userId: string): Promise<ChatInvitation[]> {
        return this.chatInvitationRepository.find({ where: { sender: { id: userId } } });
    }

    getChatInvitationById(id: string): Promise<ChatInvitation> {
        return this.chatInvitationRepository.findOneBy({ id });
    }

    createChatInvitation(chatInvitation: CreateChatInvitationDto): Promise<ChatInvitation> {
        return this.chatInvitationRepository.save(chatInvitation);
    }

    updateChatInvitation(chatInvitation: UpdateChatInvitationDto): Promise<ChatInvitation> {
        return this.chatInvitationRepository.save(chatInvitation);
    }

    deleteChatInvitationById(id: string) {
        return this.chatInvitationRepository.delete({ id });
    }

}