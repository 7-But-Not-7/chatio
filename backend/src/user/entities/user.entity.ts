import { Message } from "src/chat/entities/chat.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Settings } from "./setting.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: true})
    fullName?: string;

    @Column({unique: true})
    username: string;

    @Index()
    @Column({unique: true})
    phoneNumber: string;

    @Index()
    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    gender?: "male" | "female";

    @Column({ nullable: true })
    profilePicture?: string;

    @Column({default: null})
    emailVerifiedDate: Date;

    @Column({default: null})
    phoneNumberVerifiedDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;   

    @OneToOne(()=> Settings, (settings) => settings.user)
    settings: Settings;

    @OneToMany(()=> Message, (message) => message.user)
    messages: Message[];
}
