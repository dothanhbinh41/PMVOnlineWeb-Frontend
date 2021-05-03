import type { ReportDto, ReportRequestdto } from './models';
import { RestService } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  apiName = 'Default';

  getReport = (request: ReportRequestdto) =>
    this.restService.request<any, PagedResultDto<ReportDto>>({
      method: 'GET',
      url: `/api/app/report/report`,
      params: { startDate: request.startDate, endDate: request.endDate, departmentId: request.departmentId, skipCount: request.skipCount, maxResultCount: request.maxResultCount },
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
