import { Socket } from 'socket.io';
import { Request } from 'express';

export interface AccessTokenPayload{
    userId: string;
    deviceId: string;
}

export interface RefreshTokenPayload{
    userId: string;
    deviceId: string;
    refreshToken: string;
}

export interface GoogleRawProfile {
    id: string | null;
    displayName: string | null;
    emails: { value: string }[];
    photos: { value : string }[];
    phoneNumbers: { value: string }[];
    gender: string | null;
    name: Record<string, any> | null;

}

export interface GoogleProfile {
    id: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    name: Record<string, any>;
    profilePicture: string;
    gender: string | null;
}

export interface AuthenticatedRequest extends Request {
    authInfo: AccessTokenPayload;
}

export interface AuthenticatedWsClient extends Socket {
    authInfo: AccessTokenPayload;
}