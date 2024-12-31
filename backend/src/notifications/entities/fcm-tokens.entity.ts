import { BaseEntity } from "src/common/entities/base";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, Unique } from "typeorm";


@Entity()
@Unique(["userId", "deviceId"])
export class FcmToken extends BaseEntity {
    @Column()
    token: string;

    @Column()
    deviceId: string;

    @ManyToOne(() => User, (user) => user.fcmTokens)
    user: User;

}