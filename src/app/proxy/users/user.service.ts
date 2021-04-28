import { RestService } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { GetIdentityUsersInput, IdentityRoleDto, IdentityUserCreateDto, IdentityUserDto, IdentityUserUpdateDto, IdentityUserUpdateRolesDto } from '../volo/abp/identity/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiName = 'Default';

  create = (input: IdentityUserCreateDto) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'POST',
      url: `/api/app/user`,
      body: input,
    },
    { apiName: this.apiName });

  delete = (id: string) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/user/${id}`,
    },
    { apiName: this.apiName });

  findByEmail = (email: string) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'POST',
      url: `/api/app/user/find-by-email`,
      params: { email: email },
    },
    { apiName: this.apiName });

  findByUsername = (userName: string) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'POST',
      url: `/api/app/user/find-by-username`,
      params: { userName: userName },
    },
    { apiName: this.apiName });

  get = (id: string) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'GET',
      url: `/api/app/user/${id}`,
    },
    { apiName: this.apiName });

  getAssignableRoles = () =>
    this.restService.request<any, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: `/api/app/user/assignable-roles`,
    },
    { apiName: this.apiName });

  getList = (input: GetIdentityUsersInput) =>
    this.restService.request<any, PagedResultDto<IdentityUserDto>>({
      method: 'GET',
      url: `/api/app/user`,
      params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName });

  getRoles = (id: string) =>
    this.restService.request<any, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: `/api/app/user/${id}/roles`,
    },
    { apiName: this.apiName });

  update = (id: string, input: IdentityUserUpdateDto) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'PUT',
      url: `/api/app/user/${id}`,
      body: input,
    },
    { apiName: this.apiName });

  updateRoles = (id: string, input: IdentityUserUpdateRolesDto) =>
    this.restService.request<any, void>({
      method: 'PUT',
      url: `/api/app/user/${id}/roles`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
