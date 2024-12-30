import { BaseEntity } from "src/common/entities/base.entity";
import { Entity } from "typeorm";


@Entity()
export class ChatMember extends BaseEntity{
    role
}