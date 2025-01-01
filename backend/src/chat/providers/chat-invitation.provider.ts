import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatInvitation } from "../entities/chat-invitation.entity";


export class MessageProvider {
    constructor(@InjectRepository(ChatInvitation) private readonly chatInvitationRepository: Repository<ChatInvitation>) { }

    
}