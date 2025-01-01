import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../entities/message.entity";
import { Repository } from "typeorm";
import { File } from "../entities/file.entity";
import { CreateMessageDto } from "../dto/create-message.dto";
import { UpdateMessageDto } from "../dto/update-message.dto";
import { CreateFileDto } from "../dto/create-file.dto";


export class MessageProvider {
    constructor(
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(File) private readonly fileRepository: Repository<File>,
    ) { }

    createMessage(message: CreateMessageDto): Promise<Message> {
        return this.messageRepository.save(message);
    }

    getMessagesByChatRoomId(chatRoomId: string): Promise<Message[]> {
        return this.messageRepository.find({ where: { chatRoom: { id: chatRoomId } } });
    }

    getMessageById(id: string): Promise<Message> {
        return this.messageRepository.findOneBy({ id });
    }

    updateMessage(message: UpdateMessageDto): Promise<Message> {
        return this.messageRepository.save(message);
    }

    deleteMessageById(id: string) {
        return this.messageRepository.delete({ id });
    }

    createFile(file: CreateFileDto): Promise<File> {
        return this.fileRepository.save(file);
    }

    getFileById(id: string): Promise<File> {
        return this.fileRepository.findOneBy({ id });
    }

    deleteFileById(id: string) {
        return this.fileRepository.delete({ id });
    }

    getFilesByMessageId(messageId: string): Promise<File[]> {
        return this.fileRepository.find({ where: { message: { id: messageId } } });
    }

    updateFile(file: CreateFileDto): Promise<File> {
        return this.fileRepository.save(file);
    }
}