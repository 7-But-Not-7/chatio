export interface AccessTokenPayload{
    userId: string;
    deviceId: string;
}

export interface RefreshTokenPayload{
    userId: string;
    deviceId: string;
    refreshToken: string;
}