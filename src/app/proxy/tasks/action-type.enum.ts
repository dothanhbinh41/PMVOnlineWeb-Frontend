import { mapEnumToOptions } from '@abp/ng.core';

export enum ActionType {
  CreateTask = 0,
  ApprovedTask = 1,
  RejectedTask = 2,
  Comment = 3,
  CompletedTask = 4,
  IncompletedTask = 5,
  ChangeAssignee = 6,
  Reopen = 7,
  Follow = 8,
  Unfollow = 9,
}

export const actionTypeOptions = mapEnumToOptions(ActionType);
