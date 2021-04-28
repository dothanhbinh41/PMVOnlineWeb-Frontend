import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ChangePasswordInput, ProfileDto, UpdateProfileDto } from '../volo/abp/identity/models';

@Injectable({
  providedIn: 'root',
})
export class PMVProfileService {
  apiName = 'Default';

  changePassword = (input: ChangePasswordInput) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/p-mVProfile/change-password`,
      body: input,
    },
    { apiName: this.apiName });

  get = () =>
    this.restService.request<any, ProfileDto>({
      method: 'GET',
      url: `/api/app/p-mVProfile`,
    },
    { apiName: this.apiName });

  update = (input: UpdateProfileDto) =>
    this.restService.request<any, ProfileDto>({
      method: 'PUT',
      url: `/api/app/p-mVProfile`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
