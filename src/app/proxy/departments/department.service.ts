import type { CreateDepartmentUserDto, DeleteDepartmentUserDto, DepartmentDto, DepartmentUserDto, UpdateDepartmentUserDto } from './models';
import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  apiName = 'Default';

  addUserToDeparment = (request: CreateDepartmentUserDto) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/department/user-to-deparment`,
      body: request,
    },
    { apiName: this.apiName });

  deleteUserToDeparment = (request: DeleteDepartmentUserDto) =>
    this.restService.request<any, boolean>({
      method: 'DELETE',
      url: `/api/app/department/user-to-deparment`,
      params: { departmentId: request.departmentId, userId: request.userId },
    },
    { apiName: this.apiName });

  getAllDepartments = () =>
    this.restService.request<any, DepartmentDto[]>({
      method: 'GET',
      url: `/api/app/department/departments`,
    },
    { apiName: this.apiName });

  getDepartmentUsersById = (departmentId: number) =>
    this.restService.request<any, DepartmentUserDto[]>({
      method: 'GET',
      url: `/api/app/department/department-users-by-id/${departmentId}`,
    },
    { apiName: this.apiName });

  getDepartmentUsersByName = (department: string) =>
    this.restService.request<any, DepartmentUserDto[]>({
      method: 'GET',
      url: `/api/app/department/department-users-by-name`,
      params: { department: department },
    },
    { apiName: this.apiName });

  getUserDepartments = (id: string) =>
    this.restService.request<any, DepartmentUserDto[]>({
      method: 'GET',
      url: `/api/app/department/${id}/user-departments`,
    },
    { apiName: this.apiName });

  updateUserToDeparment = (request: UpdateDepartmentUserDto) =>
    this.restService.request<any, boolean>({
      method: 'PUT',
      url: `/api/app/department/user-to-deparment`,
      body: request,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
