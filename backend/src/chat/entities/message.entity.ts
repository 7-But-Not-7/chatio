import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { BaseEntity } from 'src/common/entities/base';
import { ChatMember } from './chat-member.entity';
import { File } from './file.entity';

@Entity()
export class Message extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => ChatMember, (chatMember) => chatMember.messages)
  author: ChatMember;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  chatRoom: ChatRoom;

  @OneToMany(() => File, (file) => file.message)
  files: File[];
}