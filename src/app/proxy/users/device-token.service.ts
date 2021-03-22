import type { SaveDeviceTokenDto } from './models';
import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceTokenService {
  apiName = 'Default';

  saveDeviceToken = (dto: SaveDeviceTokenDto) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/device-token/save-device-token`,
      body: dto,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
