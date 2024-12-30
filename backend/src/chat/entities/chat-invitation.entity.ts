import { BaseEntity } from "src/common/entities/base";
import { ChatInvitationStatus } from "src/common/enums/db.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { ChatRoom } from "./chat-room.entity";
import { User } from "src/user/entities/user.entity";


@Entity()
export class ChatInvitation extends BaseEntity {

    @Column()
    status: ChatInvitationStatus;

    @Column({default: false})
    isGroup: boolean;

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.invitations)
    chatRoom?: ChatRoom;

   
    @ManyToOne(() => User, (user) => user.invitationsReceived)
    receiver: User;

    @ManyToOne(() => User, (user) => user.invitationsSent)
    sender: User;
}