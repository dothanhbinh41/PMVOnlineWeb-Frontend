import type { EntityDto } from '@abp/ng.core';
import type { SimpleUserDto } from '../tasks/models';

export interface CreateDepartmentNameUserDto {
  name?: string;
  isLeader: boolean;
}

export interface CreateDepartmentUserDto {
  departmentId: number;
  userId?: string;
  isLeader: boolean;
}

export interface DeleteDepartmentUserDto {
  departmentId: number;
  userId?: string;
}

export interface DepartmentDto extends EntityDto<number> {
  name?: string;
}

export interface DepartmentUserDto extends EntityDto<number> {
  departmentId: number;
  deparment: DepartmentDto;
  userId?: string;
  user: SimpleUserDto;
  isLeader: boolean;
}

export interface UpdateDepartmentUserDto {
  departmentId: number;
  userId?: string;
  isLeader: boolean;
}
