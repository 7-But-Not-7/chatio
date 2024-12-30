import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Call } from "./call.entity";

@Entity()
export class CallParticipant extends BaseEntity{
    @Column()
    joinedAt: Date;

    @Column()
    leftAt: Date;

    @ManyToOne(() => Call, (call) => call.participants)
    call: Call;
}