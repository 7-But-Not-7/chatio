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
    name: Record<string, any> | null;

}

export interface GoogleProfile {
    id: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    name: Record<string, any>;
    profilePicture: string;
}