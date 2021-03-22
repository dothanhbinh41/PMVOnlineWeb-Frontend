import { mapEnumToOptions } from '@abp/ng.core';

export enum ActionType {
  CreateTask = 0,
  RequestTask = 1,
  ApprovedTask = 2,
  RejectedTask = 3,
  Comment = 4,
  CompletedTask = 5,
  IncompletedTask = 6,
  ChangeAssignee = 7,
  Reopen = 8,
  Follow = 9,
  Unfollow = 10,
}

export const actionTypeOptions = mapEnumToOptions(ActionType);
