import type { Target } from './target.enum';
import type { Priority } from './priority.enum';
import type { EntityDto } from '@abp/ng.core';
import type { Status } from './status.enum';
import type { ActionType } from './action-type.enum';
import type { CommentFileDto } from '../files/models';

export interface CommentRequestDto {
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

export interface FullTaskDto extends EntityDto<number> {
  title?: string;
  content?: string;
  dueDate?: string;
  completedDate?: string;
  priority: Priority;
  target: Target;
  status: Status;
  lastAction: ActionType;
  assigneeId?: string;
  creatorId?: string;
  referenceTasks: ReferenceTaskDto[];
  assignee: SimpleUserDto;
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

export interface ReferenceTaskDto extends EntityDto<string> {
  taskId: number;
  referenceTaskId: number;
}

export interface ReopenTaskRequest extends EntityDto<number> {
}

export interface RequestTaskRequest extends EntityDto<number> {
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
  creationTime?: string;
  note?: string;
}

export interface TaskCommentDto extends EntityDto<string> {
  taskId: number;
  comment?: string;
  userId?: string;
  fileIds: CommentFileDto[];
  user: SimpleUserDto;
  creationTime?: string;
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

export interface UserDto extends SimpleUserDto {
  roles: RoleDto[];
}