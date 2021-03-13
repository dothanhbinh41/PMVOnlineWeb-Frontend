import { mapEnumToOptions } from '@abp/ng.core';

export enum Priority {
  Normal = 0,
  High = 1,
  Highest = 2,
}

export const priorityOptions = mapEnumToOptions(Priority);
