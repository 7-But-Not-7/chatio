import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { CreateChatRoomDto } from "../dto/create-chat-room.dto";
import { UpdateChatRoomDto } from "../dto/update-chat-room.dto";


export class ChatRoomProvider {
    constructor(
        @InjectRepository(ChatRoom) private readonly chatRoomRepository: Repository<ChatRoom>
    ) { }

    getChatRoomById(id: string): Promise<ChatRoom> {
        return this.chatRoomRepository.findOneBy({ id });
    }

    createChatRoom(chatRoom: CreateChatRoomDto): Promise<ChatRoom> {
        return this.chatRoomRepository.save(chatRoom);
    }

    updateChatRoom(chatRoom: UpdateChatRoomDto): Promise<ChatRoom> {
        return this.chatRoomRepository.save(chatRoom);
    }

    deleteChatRoomById(id: string) {
        return this.chatRoomRepository.delete({ id });
    }



}