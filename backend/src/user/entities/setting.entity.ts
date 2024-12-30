import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "src/common/entities/base";
import { Themes, VideoType } from "src/common/enums/db.enum";


@Entity()
export class Settings extends BaseEntity {
    @Column({ default: Themes.LIGHT })
    theme: Themes;

    @Column({ default: true })
    receiveEmails: boolean;

    @Column({ default: true })
    receiveNotifications: boolean;

    @Column({ default: VideoType.CASUAL })
    videoType: VideoType;

    @OneToOne(() => User, (user) => user.settings)
    user: User;
}