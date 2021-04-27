import type { ExtensibleFullAuditedEntityDto, ExtensibleObject } from '@abp/ng.core';

export interface IdentityUserCreateDto extends IdentityUserCreateOrUpdateDtoBase {
  password: string;
}

export interface IdentityUserCreateOrUpdateDtoBase extends ExtensibleObject {
  userName: string;
  name?: string;
  surname?: string;
  email: string;
  phoneNumber?: string;
  lockoutEnabled: boolean;
  roleNames: string[];
}

export interface IdentityUserUpdateDto extends IdentityUserCreateOrUpdateDtoBase {
  password?: string;
  concurrencyStamp?: string;
}

export interface IdentityUserDto extends ExtensibleFullAuditedEntityDto<string> {
  tenantId?: string;
  userName?: string;
  name?: string;
  surname?: string;
  email?: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  lockoutEnabled: boolean;
  lockoutEnd?: string;
  concurrencyStamp?: string;
}
