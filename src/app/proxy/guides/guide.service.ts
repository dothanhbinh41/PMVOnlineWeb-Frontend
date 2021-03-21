import type { GuideDto } from './models';
import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GuideService {
  apiName = 'Default';

  getGuide = () =>
    this.restService.request<any, GuideDto>({
      method: 'GET',
      url: `/api/app/guide/guide`,
    },
    { apiName: this.apiName });

  setGuide = (guide: GuideDto) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/guide/set-guide`,
      body: guide,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
