import { Message } from "src/chat/entities/message.entity";
import { Column, Entity, Index, OneToMany, OneToOne } from "typeorm";
import { Settings } from "./setting.entity";
import { BaseEntity } from "src/common/entities/base";
import { ChatRoom } from "src/chat/entities/chat-room.entity";
import { ChatMember } from "src/chat/entities/chat-member.entity";
import { Notification } from "src/notifications/entities/notification.entity";
import { ChatInvitation } from "src/chat/entities/chat-invitation.entity";

@Entity()
export class User extends BaseEntity {
    @Column({ nullable: true })
    fullName?: string;

    @Column({ unique: true })
    username: string;

    @Index()
    @Column({ unique: true, nullable: true })
    phoneNumber: string;

    @Index()
    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    gender?: "male" | "female";

    @Column({ nullable: true })
    profilePicture?: string;

    @Column({ default: null })
    emailVerifiedDate?: Date;

    @Column({ default: null })
    phoneNumberVerifiedDate?: Date;

    @Column({ default: null })
    googleId?: string;

    @Column({ default: null })
    appleId?: string;

    @Column({ default: null })
    lastSeen?: Date;

    @OneToOne(() => Settings, (settings) => settings.user)
    settings: Settings;

    @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.createdBy)
    createdChatRooms: ChatRoom[];

    @OneToMany(() => ChatMember, (chatMember) => chatMember.user)
    chatMembers: ChatMember[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];

    @OneToMany(() => ChatInvitation, (chatInvitation) => chatInvitation.receiver)
    invitationsReceived: ChatInvitation[];

    @OneToMany(() => ChatInvitation, (chatInvitation) => chatInvitation.sender)
    invitationsSent: ChatInvitation[];
}
