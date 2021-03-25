import type { CreateDeparmentUserDto, DeleteDeparmentUserDto, DepartmentDto, DepartmentUserDto, UpdateDeparmentUserDto } from './models';
import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  apiName = 'Default';

  addUserToDeparment = (request: CreateDeparmentUserDto) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/department/user-to-deparment`,
      body: request,
    },
    { apiName: this.apiName });

  deleteUserToDeparment = (request: DeleteDeparmentUserDto) =>
    this.restService.request<any, boolean>({
      method: 'DELETE',
      url: `/api/app/department/user-to-deparment`,
      params: { deparmentId: request.deparmentId, userId: request.userId },
    },
    { apiName: this.apiName });

  getAllDepartments = () =>
    this.restService.request<any, DepartmentDto[]>({
      method: 'GET',
      url: `/api/app/department/departments`,
    },
    { apiName: this.apiName });

  getDepartmentUsers = (department: string) =>
    this.restService.request<any, DepartmentUserDto[]>({
      method: 'GET',
      url: `/api/app/department/department-users`,
      params: { department: department },
    },
    { apiName: this.apiName });

 

  updateUserToDeparment = (request: UpdateDeparmentUserDto) =>
    this.restService.request<any, boolean>({
      method: 'PUT',
      url: `/api/app/department/user-to-deparment`,
      body: request,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
