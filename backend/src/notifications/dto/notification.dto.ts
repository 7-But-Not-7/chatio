import { NotificationJob } from "src/common/types/notification";

export class NotificationDto implements NotificationJob {
    readonly to: string;
    readonly data: NotificationJob["data"];

    constructor(to: string, data: any) {
        this.to = to;
        this.data = {}
    }
}