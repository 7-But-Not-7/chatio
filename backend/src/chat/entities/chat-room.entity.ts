import { BaseEntity } from "src/common/entities/base.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Message } from "./message.entity";
import { Call } from "src/call/entities/call.entity";
import { ChatMember } from "./chat-member.entity";


@Entity()
export class ChatRoom extends BaseEntity{
    @Column({nullable: true})
    name?: string;

    @Column({nullable: true})
    description?: string;

    @Column({nullable: true, default: false})
    isGroup: boolean;

    @OneToMany(() => ChatMember, (chatMember) => chatMember.chatRoom)
    members: ChatMember[];

    @ManyToOne(() => User, (user) => user.createdChatRooms)
    createdBy: User;

    @OneToMany(() => Call, (call) => call.chatRoom)
    calls: Call[];

    @OneToMany(() => Message, (message) => message.chatRoom)
    messages: Message[];
}