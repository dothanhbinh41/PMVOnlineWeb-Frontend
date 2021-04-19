import { mapEnumToOptions } from '@abp/ng.core';

export enum Status {
  Pending = 0,
  Requested = 1,
  Approved = 2,
  Rejected = 3,
  Completed = 4,
  Incompleted = 5,
  Rated = 6,
  LeaderRated = 7,
  Done = 8,
}

export const statusOptions = mapEnumToOptions(Status);
