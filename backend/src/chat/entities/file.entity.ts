import { BaseEntity } from "src/common/entities/base";
import { FileType } from "src/common/enums/db.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { Message } from "./message.entity";


@Entity()
export class File extends BaseEntity {
    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    type: FileType;

    @Column()
    size: number;

    @ManyToOne(() => Message, (message) => message.files)
    message: Message;
}