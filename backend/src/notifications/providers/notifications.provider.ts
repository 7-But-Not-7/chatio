import { Inject, Injectable } from "@nestjs/common";
import { Notification } from "../entities/notification.entity";
import { Repository } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class NotificationsProvider {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }
}