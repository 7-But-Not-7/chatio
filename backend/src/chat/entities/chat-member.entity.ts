import { BaseEntity } from "src/common/entities/base.entity";
import { ChatMemberRole } from "src/common/enums/db.enum";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Message } from "./message.entity";


@Entity()
export class ChatMember extends BaseEntity{
    @Column({default: ChatMemberRole.MEMBER})
    role: ChatMemberRole;

    @Column({default: false})
    isMuted: boolean;

    @ManyToOne(() => User, (user) => user.chatMembers)
    user: User;

    @OneToMany(() => Message, (message) => message.author)
    messages: Message[];
}