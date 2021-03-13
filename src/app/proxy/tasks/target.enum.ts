import { mapEnumToOptions } from '@abp/ng.core';

export enum Target {
  BuyCommodity = 0,
  Payment = 1,
  Storage = 2,
  Make = 3,
  Other = 4,
  BuyOther = 5,
}

export const targetOptions = mapEnumToOptions(Target);
