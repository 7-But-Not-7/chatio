import { BaseEntity } from "src/common/entities/base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Call } from "./call.entity";
import { ChatMember } from "src/chat/entities/chat-member.entity";

@Entity()
export class CallParticipant extends BaseEntity {
    @Column()
    joinedAt: Date;

    @Column()
    leftAt: Date;

    @ManyToOne(() => Call, (call) => call.participants)
    call: Call;

    @ManyToOne(() => ChatMember, (chatMember) => chatMember.calls)
    chatMember: ChatMember;
}