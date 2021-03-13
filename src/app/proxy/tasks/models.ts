import type { Target } from './target.enum';
import type { Priority } from './priority.enum';
import type { EntityDto, PagedResultRequestDto } from '@abp/ng.core';
import type { Status } from './status.enum';
import type { ActionType } from './action-type.enum';

export interface CommentRequestDto {
  taskId: number;
  comment?: string;
  files: string[];
}

export interface CreateTaskRequestDto {
  title?: string;
  content?: string;
  target: Target;
  priority: Priority;
  dueDate?: string;
  files: string[];
  referenceTasks: number[];
  assigneeId?: string;
}

export interface FinishTaskRequest extends EntityDto<number> {
  completed: boolean;
  completedDate?: string;
  note?: string;
}

export interface FollowTaskRequest extends EntityDto<number> {
  follow: boolean;
}

export interface MyTaskDto {
  id: number;
  title?: string;
  dueDate?: string;
  completedDate?: string;
  priority: Priority;
  target: Target;
  status: Status;
  assignee: SimpleUserDto;
  creator: SimpleUserDto;
  lastModifier: SimpleUserDto;
  lastAction: ActionType;
}

export interface ProcessTaskRequest extends EntityDto<number> {
  approved: boolean;
  note?: string;
}

export interface ReopenTaskRequest extends EntityDto<number> {
}

export interface RoleDto {
  roleId?: string;
}

export interface SimpleUserDto extends EntityDto<string> {
  name?: string;
  surname?: string;
}

export interface TaskActionDto {
  actor: SimpleUserDto;
  action: ActionType;
}

export interface TaskDto extends EntityDto<number> {
  title?: string;
  content?: string;
  dueDate?: string;
  completedDate?: string;
  priority: Priority;
  target: Target;
  status: Status;
  assigneeId?: string;
}

export interface TaskHistoryRequestDto extends PagedResultRequestDto {
  taskId: number;
}

export interface UserDto extends SimpleUserDto {
  roles: RoleDto[];
}
