import { BaseEntity } from "src/common/entities/base.entity";
import { ChatMemberRole } from "src/common/enums/db.enum";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Message } from "./message.entity";
import { ChatRoom } from "./chat-room.entity";
import { Call } from "src/call/entities/call.entity";
import { CallParticipant } from "src/call/entities/call-participant.entity";


@Entity()
export class ChatMember extends BaseEntity{
    @Column({default: ChatMemberRole.MEMBER})
    role: ChatMemberRole;

    @Column({default: false})
    isMuted: boolean;

    @Column({default: false})
    isBanned: boolean;

    @Column({nullable: true})
    deletedAt: Date;

    @ManyToOne(() => User, (user) => user.chatMembers)
    user: User;

    @OneToMany(() => Message, (message) => message.author)
    messages: Message[];

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.members)
    chatRoom: ChatRoom;

    @OneToMany(() => Call, (call) => call.caller)
    callsInitiated: Call[];

    @OneToMany(() => CallParticipant, (callParticipant) => callParticipant.chatMember)
    calls: CallParticipant[];
}