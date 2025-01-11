import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatMember } from "../entities/chat-member.entity";
import { CreateChatMemberDto } from "../dto/create-chat-member.dto";
import { UpdateChatMemberDto } from "../dto/update-chat-member.dto";
import { ChatRoom } from "../entities/chat-room.entity";


export class ChatMemeberProvider {
    constructor(
        @InjectRepository(ChatMember) private readonly chatMemberRepository: Repository<ChatMember>,
    ) { }

    createChatMember(chatMember: CreateChatMemberDto): Promise<ChatMember> {
        return this.chatMemberRepository.save(chatMember);
    }

    removeMemberFromChatRoom(chatMemberId: string) {
        return this.chatMemberRepository.delete({ id: chatMemberId });
    }

    getChatMembersByChatRoomId(chatRoomId: string): Promise<ChatMember[]> {
        return this.chatMemberRepository.find({ where: { chatRoom: { id: chatRoomId } } });
    }

    getChatMemberById(id: string): Promise<ChatMember> {
        return this.chatMemberRepository.findOneBy({ id });
    }

    async getChatRoomsByUserId(userId: string): Promise<ChatRoom[]> {
        const chatMembers = await this.chatMemberRepository.find({ where: { user: { id: userId } } });
        return chatMembers.map(chatMember => chatMember.chatRoom);
    }

    updateChatMember(chatMember: UpdateChatMemberDto): Promise<ChatMember> {
        return this.chatMemberRepository.save(chatMember);
    }

    deleteChatMemberById(id: string) {
        return this.chatMemberRepository.delete({ id });
    }

}