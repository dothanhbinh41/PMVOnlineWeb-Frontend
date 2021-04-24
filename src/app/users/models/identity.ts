import { PagedResultDto } from '@abp/ng.core';
import { DepartmentDto, DepartmentUserDto } from '@proxy/departments';
import { IdentityRoleDto, IdentityUserDto } from '../proxy/identity/models';

// tslint:disable-next-line:no-namespace
export namespace Identity {
  export interface State {
    roles: PagedResultDto<IdentityRoleDto>;
    departments: DepartmentUserDto[];
    users: PagedResultDto<IdentityUserDto>;
    selectedRole: IdentityRoleDto;
    selectedUser: IdentityUserDto;
    selectedUserRoles: IdentityRoleDto[];
  }
}
