import type { UserDepartmentCreateDto } from './models';
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

  constructor(private restService: RestService) {}
}
