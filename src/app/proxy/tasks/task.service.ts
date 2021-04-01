import type { CommentRequestDto, CreateTaskRequestDto, FinishTaskRequest, FollowTaskRequest, FullTaskDto, MyTaskDto, ProcessTaskRequest, ReopenTaskRequest, RequestTaskRequest, TaskActionDto, TaskCommentDto, TaskDto, UserDto } from './models';
import type { Target } from './target.enum';
import { RestService } from '@abp/ng.core';
import type { PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { FileDto } from '../files/models';

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

  getNoteById = (id: number) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: `/api/app/task/${id}/note`,
    },
    { apiName: this.apiName });

  getTaskById = (id: number) =>
    this.restService.request<any, FullTaskDto>({
      method: 'GET',
      url: `/api/app/task/${id}/task`,
    },
    { apiName: this.apiName });

  getTaskCommentsById = (id: number) =>
    this.restService.request<any, TaskCommentDto[]>({
      method: 'GET',
      url: `/api/app/task/${id}/task-comments`,
    },
    { apiName: this.apiName });

  getTaskFilesById = (id: number) =>
    this.restService.request<any, FileDto[]>({
      method: 'GET',
      url: `/api/app/task/${id}/task-files`,
    },
    { apiName: this.apiName });

  getTaskHistoryById = (id: number) =>
    this.restService.request<any, TaskActionDto[]>({
      method: 'GET',
      url: `/api/app/task/${id}/task-history`,
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

  requestTaskByRequest = (request: RequestTaskRequest) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/task/request-task`,
      body: request,
    },
    { apiName: this.apiName });

  sendCommentByIdAndRequest = (id: number, request: CommentRequestDto) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/task/${id}/send-comment`,
      body: request,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
