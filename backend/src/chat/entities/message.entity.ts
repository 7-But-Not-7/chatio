import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ChatMember } from './chat-member.entity';

@Entity()
export class Message extends BaseEntity{
  @Column()
  content: string;

  @ManyToOne(() => ChatMember, (chatMember) => chatMember.messages)
  author: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  chatRoom: ChatRoom;
}