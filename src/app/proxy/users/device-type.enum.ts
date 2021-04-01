import { mapEnumToOptions } from '@abp/ng.core';

export enum DeviceType {
  Android = 0,
  iOS = 1,
  Other = 2,
}

export const deviceTypeOptions = mapEnumToOptions(DeviceType);
