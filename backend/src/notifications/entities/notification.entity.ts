import { BaseEntity } from "src/common/entities/base.entity";
import { NotificationType } from "src/common/enums/notification.enum";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";


@Entity()
export class Notification extends BaseEntity {

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    type: NotificationType;

    @ManyToOne(() => User, (user) => user.notifications)
    user: User;

    @Column({ default: null })
    readDate?: Date;

    @Column({ default: null })
    deletedDate?: Date;

    @Column({ default: null })
    actionURL?: string;

    @Column({ default: null })
    image?: string;
}