import { DeviceDto } from "src/auth/dtos/device.data.dto";

export interface SessionData{
    userId: string;
    deviceId: string;
    refreshToken: string;
    device: DeviceDto;
}