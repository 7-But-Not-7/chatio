import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FcmToken } from "../entities/fcm-tokens.entity";
import { Repository } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { CreateFcmTokenDto } from "../dto/create-fcm-token.dto";

@Injectable()
export class FcmTokensProvider {
    constructor(
        @InjectRepository(FcmToken)
        private readonly fcmTokenRepository: Repository<FcmToken>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    getToken(token: string) {
        return this.fcmTokenRepository.findOne({ where: { token } })
    }

    createToken(createFcmTokenDto: CreateFcmTokenDto) {
        return this.fcmTokenRepository.save(createFcmTokenDto)
    }

    updateToken(id: string, token: string) {
        return this.fcmTokenRepository.update(id, { token })
    }

    getUserTokens(userId: string) {
        return this.fcmTokenRepository.find({ where: { user: { id: userId } } })
    }

    deleteToken(token: string) {
        return this.fcmTokenRepository.delete({ token })
    }
}