import type { UserDepartmentCreateDto, UserDepartmentUpdateDto } from './models';
import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { IdentityUserDto } from '../volo/abp/identity/models';

@Injectable({
  providedIn: 'root',
})
export class DepartmentIdentityUserService {
  apiName = 'Default';

  createNew = (input: UserDepartmentCreateDto) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'POST',
      url: `/api/app/department-identity-user/new`,
      body: input,
    },
    { apiName: this.apiName });

  update = (id: string, input: UserDepartmentUpdateDto) =>
    this.restService.request<any, IdentityUserDto>({
      method: 'PUT',
      url: `/api/app/department-identity-user/${id}`,
      body: input,
    },
    { apiName: this.apiName });

  updateDepartmentsByIdAndInput = (id: string, input: UserDepartmentUpdateDto) =>
    this.restService.request<any, boolean>({
      method: 'PUT',
      url: `/api/app/department-identity-user/${id}/departments`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
