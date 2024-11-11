import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export type Theme = "light" | "dark";
export type VideoType = "professional" | "casual";

@Entity()
export class Settings {
    @PrimaryGeneratedColumn("uuid")
    id: string;

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