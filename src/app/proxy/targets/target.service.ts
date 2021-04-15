import type { AddOrEditDepartmentsToTargetDto, NameTargetDto, TargetDto } from './models';
import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DepartmentDto } from '../departments/models';

@Injectable({
  providedIn: 'root',
})
export class TargetService {
  apiName = 'Default';

  addOrEditDepartmentsToTarget = (targetId: number, request: AddOrEditDepartmentsToTargetDto) =>
    this.restService.request<any, DepartmentDto[]>({
      method: 'POST',
      url: `/api/app/target/or-edit-departments-to-target/${targetId}`,
      body: request,
    },
    { apiName: this.apiName });

  createTargets = (request: NameTargetDto) =>
    this.restService.request<any, TargetDto>({
      method: 'POST',
      url: `/api/app/target/targets`,
      body: request,
    },
    { apiName: this.apiName });

  deleteTargets = (id: number) =>
    this.restService.request<any, boolean>({
      method: 'DELETE',
      url: `/api/app/target/${id}/targets`,
    },
    { apiName: this.apiName });

  getAllTargets = () =>
    this.restService.request<any, TargetDto[]>({
      method: 'GET',
      url: `/api/app/target/targets`,
    },
    { apiName: this.apiName });

  getDepartmentsByTarget = (targetId: number) =>
    this.restService.request<any, DepartmentDto[]>({
      method: 'GET',
      url: `/api/app/target/departments-by-target/${targetId}`,
    },
    { apiName: this.apiName });

  updateTargets = (id: number, request: NameTargetDto) =>
    this.restService.request<any, TargetDto>({
      method: 'PUT',
      url: `/api/app/target/${id}/targets`,
      body: request,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}