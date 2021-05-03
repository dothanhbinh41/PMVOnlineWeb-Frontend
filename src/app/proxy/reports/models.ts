import type { EntityDto, PagedResultRequestDto } from '@abp/ng.core';
import type { Priority } from '../tasks/priority.enum';
import type { Status } from '../tasks/status.enum';
import type { SimpleUserDto, TaskActionDto, TaskCommentDto, TaskDto, TaskRatingDto } from '../tasks/models';
import type { TargetDto } from '../targets/models';
import type { TaskFileDto } from '../files/models';

export interface ReportDto extends EntityDto<number> {
  title?: string;
  content?: string;
  dueDate?: string;
  completedDate?: string;
  creationTime?: string;
  priority: Priority;
  targetId: number;
  status: Status;
  assignee: SimpleUserDto;
  creator: SimpleUserDto;
  taskComments: TaskCommentDto[];
  referenceTasks: TaskDto[];
  taskRatings: TaskRatingDto[];
  taskHistory: TaskActionDto[];
  target: TargetDto;
  taskFiles: TaskFileDto[];
}

export interface ReportRequestdto extends PagedResultRequestDto {
  startDate?: string;
  endDate?: string;
  departmentId?: number;
}
