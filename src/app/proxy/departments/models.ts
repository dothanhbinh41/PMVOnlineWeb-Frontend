import type { SimpleUserDto } from '../tasks/models';

export interface CreateDeparmentUserDto {
  deparmentId: number;
  userId?: string;
  isLeader: boolean;
}

export interface DeleteDeparmentUserDto {
  deparmentId: number;
  userId?: string;
}

export interface DepartmentDto   {
  name?: string;
  id : number;
}

export interface DepartmentUserDto {
  deparmentId: number;
  deparment: DepartmentDto;
  userId?: string;
  user: SimpleUserDto;
  isLeader: boolean;
}

export interface UpdateDeparmentUserDto {
  deparmentId: number;
  userId?: string;
  isLeader: boolean;
}
