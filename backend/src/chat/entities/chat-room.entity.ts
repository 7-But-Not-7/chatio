import { BaseEntity } from "src/common/entities/base.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Message } from "./message.entity";


@Entity()
export class ChatRoom extends BaseEntity{
    @Column({nullable: true})
    name?: string;

    @Column({nullable: true})
    description?: string;

    @Column({nullable: true, default: false})
    isGroup: boolean;

    @ManyToOne(() => User, (user) => user.createdChatRooms)
    createdBy: User;

    @OneToMany(() => Message, (message) => message.chatRoom)
    messages: Message[];
}