import { ChatMember } from "src/chat/entities/chat-member.entity";
import { ChatRoom } from "src/chat/entities/chat-room.entity";
import { BaseEntity } from "src/common/entities/base";
import { CallStatus, CallType } from "src/common/enums/db.enum";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CallParticipant } from "./call-participant.entity";


@Entity()
export class Call extends BaseEntity {

    @Column()
    type: CallType;

    @Column()
    status: CallStatus;

    @Column()
    startedAt: Date;

    @Column()
    endedAt: Date;

    @Column({ nullable: true })
    recordingUrl?: string;

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.calls)
    chatRoom: ChatRoom;

    @ManyToOne(() => ChatMember, (chatMember) => chatMember.callsInitiated)
    caller: ChatMember;

    @OneToMany(() => CallParticipant, (callParticipant) => callParticipant.call)
    participants: CallParticipant[];
}