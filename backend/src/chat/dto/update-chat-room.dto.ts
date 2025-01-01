import { PartialType, PickType } from "@nestjs/mapped-types";
import { ChatRoom } from "../entities/chat-room.entity";

export class UpdateChatRoomDto extends PartialType(PickType(ChatRoom, ['name', 'description', 'isGroup', 'isDeleted'])) {}