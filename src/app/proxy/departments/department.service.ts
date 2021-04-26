import type {
  CreateDepartmentUserDto,
  DeleteDepartmentUserDto,
  DepartmentDto,
  DepartmentUserDto,
  NameDepartmentDto,
  UpdateDepartmentUserDto,
} from './models';
import { PagedResultDto, RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  apiName = 'Default';

  addUserToDepartment = (request: CreateDepartmentUserDto) =>
    this.restService.request<any, boolean>(
      {
        method: 'POST',
        url: `/api/app/department/user-to-department`,
        body: request,
      },
      { apiName: this.apiName }
    );

  createTargets = (request: NameDepartmentDto) =>
    this.restService.request<any, DepartmentDto>(
      {
        method: 'POST',
        url: `/api/app/department/targets`,
        body: request,
      },
      { apiName: this.apiName }
    );

  deleteTargets = (id: number) =>
    this.restService.request<any, boolean>(
      {
        method: 'DELETE',
        url: `/api/app/department/${id}/targets`,
      },
      { apiName: this.apiName }
    );
  createDepartment = (request: NameDepartmentDto) =>
    this.restService.request<any, DepartmentDto>({
      method: 'POST',
      url: `/api/app/department/department`,
      body: request,
    },
    { apiName: this.apiName });

  deleteUserToDepartment = (request: DeleteDepartmentUserDto) =>
    this.restService.request<any, boolean>(
      {
        method: 'DELETE',
        url: `/api/app/department/user-to-department`,
        params: { departmentId: request.departmentId, userId: request.userId },
      },
      { apiName: this.apiName }
    );

  getAllDepartments = () =>
    this.restService.request<any, DepartmentDto[]>(
      {
        method: 'GET',
        url: `/api/app/department/departments`,
      },
      { apiName: this.apiName }
    );

  deleteDepartment = (id: number) =>
    this.restService.request<any, boolean>(
      {
        method: 'DELETE',
        url: `/api/app/department/${id}/department`,
      },
      { apiName: this.apiName }
    );

  getDepartments = () =>
    this.restService.request<any, PagedResultDto<DepartmentDto>>(
      {
        method: 'GET',
        url: `/api/app/department/departments`,
      },
      { apiName: this.apiName }
    );

  getDepartmentUsersById = (departmentId: number) =>
    this.restService.request<any, DepartmentUserDto[]>(
      {
        method: 'GET',
        url: `/api/app/department/department-users-by-id/${departmentId}`,
      },
      { apiName: this.apiName }
    );

  getDepartmentUsersByName = (department: string) =>
    this.restService.request<any, DepartmentUserDto[]>(
      {
        method: 'GET',
        url: `/api/app/department/department-users-by-name`,
        params: { department: department },
      },
      { apiName: this.apiName }
    );

  getMyDepartments = () =>
    this.restService.request<any, DepartmentUserDto[]>(
      {
        method: 'GET',
        url: `/api/app/department/my-departments`,
      },
      { apiName: this.apiName }
    );

  getUserDepartments = (id: string) =>
    this.restService.request<any, DepartmentUserDto[]>(
      {
        method: 'GET',
        url: `/api/app/department/${id}/user-departments`,
      },
      { apiName: this.apiName }
    );

  updateTargets = (id: number, request: NameDepartmentDto) =>
    this.restService.request<any, DepartmentDto>(
      {
        method: 'PUT',
        url: `/api/app/department/${id}/targets`,
        body: request,
      },
      { apiName: this.apiName }
    );
  updateDepartment = (id: number, request: NameDepartmentDto) =>
    this.restService.request<any, DepartmentDto>({
      method: 'PUT',
      url: `/api/app/department/${id}/department`,
      body: request,
    },
    { apiName: this.apiName });

  updateUserToDepartment = (request: UpdateDepartmentUserDto) =>
    this.restService.request<any, boolean>(
      {
        method: 'PUT',
        url: `/api/app/department/user-to-department`,
        body: request,
      },
      { apiName: this.apiName }
    );

  constructor(private restService: RestService) {}
}
