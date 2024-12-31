import { Inject, Injectable } from "@nestjs/common";
import { Notification } from "../entities/notification.entity";
import { Repository } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateNotificationDto } from "../dto/create-notification.dto";


@Injectable()
export class NotificationsProvider {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    getNotification(id: string) {
        return this.notificationRepository.findOneBy({ id })
    }

    getUserNotifications(userId: string) {
        return this.notificationRepository.find({ where: { user: { id: userId } } })
    }

    createNotification(createNotificationDto: CreateNotificationDto) {
        return this.notificationRepository.save(createNotificationDto)
    }

    updateNotification(id: string, notification: Partial<Notification>) {
        return this.notificationRepository.update(id, notification)
    }

    deleteNotification(id: string) {
        return this.notificationRepository.delete({ id })
    }

    markNotificationAsRead(id: string) {
        return this.notificationRepository.update(id, { readDate: new Date() })
    }

    markAllNotificationsAsRead(userId: string) {
        return this.notificationRepository.update({ user: { id: userId }, readDate: null }, { readDate: new Date() })
    }

    deleteAllUserNotifications(userId: string) {
        return this.notificationRepository.delete({ user: { id: userId } })
    }

}