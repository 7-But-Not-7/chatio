import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../entities/message.entity";
import { Repository } from "typeorm";


export class MessageProvider {
    constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) { }

    
}