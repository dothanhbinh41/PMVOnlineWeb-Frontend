import type { DeviceType } from './device-type.enum';
import type { IdentityUserCreateDto } from '../volo/abp/identity/models';
import type { CreateDepartmentNameUserDto } from '../departments/models';

export interface SaveDeviceTokenDto {
  token?: string;
  device: DeviceType;
}

export interface UserDepartmentCreateDto extends IdentityUserCreateDto {
  departments: CreateDepartmentNameUserDto[];
}
