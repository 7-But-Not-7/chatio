import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "src/common/entities/base.entity";

export type Theme = "light" | "dark";
export type VideoType = "professional" | "casual";

@Entity()
export class Settings extends BaseEntity{
    @Column({default: "light"})
    theme: Theme;

    @Column({default: true})
    receiveEmails: boolean;

    @Column({default: true})
    receiveNotifications: boolean;

    @Column({default: "casual"})
    videoType: VideoType;

    @OneToOne(() => User, (user) => user.settings)
    user: User;
}