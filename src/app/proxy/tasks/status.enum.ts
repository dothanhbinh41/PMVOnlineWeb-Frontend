import { mapEnumToOptions } from '@abp/ng.core';

export enum Status {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Completed = 3,
  Incompleted = 4,
}

export const statusOptions = mapEnumToOptions(Status);
