import { Message } from "src/chat/entities/chat.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Settings } from "./setting.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    firstName?: string;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    phoneNumber: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    gender?: "male" | "female";

    @Column({ nullable: true })
    profilePicture?: string;

    @Column({default: null})
    emailVerifiedDate: boolean;

    @Column({default: null})
    phoneNumberVerifiedDate: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;   

    @OneToOne(()=> Settings, (settings) => settings.user)
    settings: Settings;

    @OneToMany(()=> Message, (message) => message.user)
    messages: Message[];
}
