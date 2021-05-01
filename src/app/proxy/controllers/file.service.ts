import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  apiName = 'Default';

  downloadFileById = (id: string) =>
    this.restService.request<any, ActionResult<string>>({
      method: 'GET',
      url: `/api/File/DownloadFile`,
      params: { id: id },
    },
    { apiName: this.apiName });

  uploadFile = () =>
    this.restService.request<any, ActionResult<string>>({
      method: 'POST',
      url: `/api/File/UploadFile`,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
