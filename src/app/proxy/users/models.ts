import type { DeviceType } from './device-type.enum';
import type { IdentityUserCreateDto, IdentityUserUpdateDto } from '../volo/abp/identity/models';
import type { CreateDepartmentNameUserDto } from '../departments/models';

export interface SaveDeviceTokenDto {
  token?: string;
  device: DeviceType;
}

export interface UserDepartmentCreateDto extends IdentityUserCreateDto {
  departments: CreateDepartmentNameUserDto[];
}

export interface UserDepartmentUpdateDto extends IdentityUserUpdateDto {
  departments: CreateDepartmentNameUserDto[];
}
