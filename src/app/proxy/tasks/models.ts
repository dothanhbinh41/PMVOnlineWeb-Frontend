import type { Priority } from './priority.enum';
import type { EntityDto, PagedResultRequestDto } from '@abp/ng.core';
import type { TargetDto } from '../targets/models';
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
  targetId: number;
  priority: Priority;
  dueDate?: Date;
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
  target: TargetDto;
  targetId: number;
  status: Status;
  lastAction: ActionType;
  assigneeId?: string;
  creatorId?: string;
  creationTime?: string;
  assignee: SimpleUserDto;
}

export interface MyTaskDto {
  id: number;
  title?: string;
  dueDate?: string;
  completedDate?: string;
  creationTime?: string;
  priority: Priority;
  targetId: number;
  target: TargetDto;
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

export interface RatingRequestDto {
  rating: number;
}

export interface ReopenTaskRequest extends EntityDto<number> {
}

export interface RequestTaskRequest extends EntityDto<number> {
}

export interface SearchMyTaskRequestDto extends PagedResultRequestDto {
  startDate?: string;
  endDate?: string;
  users: string[];
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
  creationTime?: string;
  priority: Priority;
  targetId: number;
  status: Status;
  assigneeId?: string;
}

export interface UpdateTaskRequestDto extends CreateTaskRequestDto {
  id: number;
}

export interface UserDto extends SimpleUserDto {
}
