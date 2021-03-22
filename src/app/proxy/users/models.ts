import type { DeviceType } from './device-type.enum';

export interface SaveDeviceTokenDto {
  token?: string;
  device: DeviceType;
}
