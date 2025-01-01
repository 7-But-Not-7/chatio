import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../entities/message.entity";
import { Repository } from "typeorm";
import { File } from "../entities/file.entity";


export class MessageProvider {
    constructor(
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(File) private readonly fileRepository: Repository<File>,
    ) { }


}