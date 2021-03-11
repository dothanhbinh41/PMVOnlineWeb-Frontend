import type { CommentRequestDto, CreateTaskRequestDto, FinishTaskRequest, FollowTaskRequest, MyTaskDto, ProcessTaskRequest, ReopenTaskRequest, TaskActionDto, TaskDto, TaskHistoryRequestDto, UserDto } from './models';
import type { Target } from './target.enum';
import { RestService } from '@abp/ng.core';
import type { PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  apiName = 'Default';

  createTaskByRequest = (request: CreateTaskRequestDto) =>
    this.restService.request<any, TaskDto>({
      method: 'POST',
      url: `/api/app/task/task`,
      body: request,
    },
    { apiName: this.apiName });

  finishTaskByRequest = (request: FinishTaskRequest) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/task/finish-task`,
      body: request,
    },
    { apiName: this.apiName });

  followTaskByRequest = (request: FollowTaskRequest) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/task/follow-task`,
      body: request,
    },
    { apiName: this.apiName });

  getAllMemberByTarget = (target: Target) =>
    this.restService.request<any, UserDto[]>({
      method: 'GET',
      url: `/api/app/task/member`,
      params: { target: target },
    },
    { apiName: this.apiName });

  getAssigneeByTarget = (target: Target) =>
    this.restService.request<any, UserDto>({
      method: 'GET',
      url: `/api/app/task/assignee`,
      params: { target: target },
    },
    { apiName: this.apiName });

  getMyActions = () =>
    this.restService.request<any, MyTaskDto[]>({
      method: 'GET',
      url: `/api/app/task/my-actions`,
    },
    { apiName: this.apiName });

  getMyTasksByRequest = (request: PagedResultRequestDto) =>
    this.restService.request<any, MyTaskDto[]>({
      method: 'GET',
      url: `/api/app/task/my-tasks`,
      params: { maxResultCount: request.maxResultCount, skipCount: request.skipCount },
    },
    { apiName: this.apiName });

  getTaskHistoryByRequest = (request: TaskHistoryRequestDto) =>
    this.restService.request<any, TaskActionDto[]>({
      method: 'GET',
      url: `/api/app/task/task-history`,
      params: { taskId: request.taskId, skipCount: request.skipCount, maxResultCount: request.maxResultCount },
    },
    { apiName: this.apiName });

  processTaskByRequest = (request: ProcessTaskRequest) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/task/process-task`,
      body: request,
    },
    { apiName: this.apiName });

  reopenTaskByRequest = (request: ReopenTaskRequest) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/task/reopen-task`,
      body: request,
    },
    { apiName: this.apiName });

  sendCommentByRequest = (request: CommentRequestDto) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/task/send-comment`,
      body: request,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
