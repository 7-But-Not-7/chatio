import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { ChatMember } from "../entities/chat-member.entity";


export class ChatRoomProvider {
    constructor(
        @InjectRepository(ChatRoom) private readonly chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(ChatMember) private readonly chatMemberRepository: Repository<ChatMember>,
    ) { }

    
}