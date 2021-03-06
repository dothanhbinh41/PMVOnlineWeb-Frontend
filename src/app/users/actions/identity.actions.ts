import { Identity } from '../models/identity';
import { ABP, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import {
  GetIdentityUsersInput,
  IdentityRoleCreateDto,
  IdentityRoleUpdateDto,
  IdentityUserCreateDto,
  IdentityUserUpdateDto,
} from '../proxy/identity/models';
import { UserDepartmentCreateDto, UserDepartmentUpdateDto } from '@proxy/users';

export class GetRoles {
  static readonly type = '[Identity] Get Roles';
  constructor(public payload?: PagedAndSortedResultRequestDto) {}
}

export class GetRoleById {
  static readonly type = '[Identity] Get Role By Id';
  constructor(public payload: string) {}
}

export class DeleteRole {
  static readonly type = '[Identity] Delete Role';
  constructor(public payload: string) {}
}

export class CreateRole {
  static readonly type = '[Identity] Create Role';
  constructor(public payload: IdentityRoleCreateDto) {}
}

export class UpdateRole {
  static readonly type = '[Identity] Update Role';
  constructor(public payload: IdentityRoleUpdateDto & { id: string }) {}
}

export class GetUsers {
  static readonly type = '[Identity] Get Users';
  constructor(public payload?: GetIdentityUsersInput) {}
}

export class GetUserById {
  static readonly type = '[Identity] Get User By Id';
  constructor(public payload: string) {}
}

export class DeleteUser {
  static readonly type = '[Identity] Delete User';
  constructor(public payload: string) {}
}

export class CreateUser {
  static readonly type = '[Identity] Create User';
  constructor(public payload: UserDepartmentCreateDto) {}
}

export class UpdateUser {
  static readonly type = '[Identity] Update User';
  constructor(public payload: UserDepartmentUpdateDto & { id: string }) {}
}

export class GetUserRoles {
  static readonly type = '[Identity] Get User Roles';
  constructor(public payload: string) {}
}

export class GetUserDepartments {
  static readonly type = '[Identity] Get User Departments';
  constructor(public payload: string) {}
}
