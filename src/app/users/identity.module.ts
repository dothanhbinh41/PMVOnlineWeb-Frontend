import { CoreModule, LazyModuleFactory } from '@abp/ng.core';
import { PermissionManagementModule } from '@abp/ng.permission-management';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { UiExtensionsModule } from '@abp/ng.theme.shared/extensions';
import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { NgxsModule } from '@ngxs/store';
import { IsAdminGuard } from '../admin/is-admin-guard';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';
import { IdentityExtensionsGuard } from './guards/extensions.guard';
import { IdentityRoutingModule } from './identity-routing.module';
import { IdentityConfigOptions } from './models/config-options';
import { IdentityState } from './states/identity.state';
import {
  IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS,
  IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS,
  IDENTITY_ENTITY_ACTION_CONTRIBUTORS,
  IDENTITY_ENTITY_PROP_CONTRIBUTORS,
  IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS,
} from './tokens/extensions.token';

@NgModule({
  declarations: [RolesComponent, UsersComponent],
  exports: [RolesComponent, UsersComponent],
  imports: [
    NgxsModule.forFeature([IdentityState]),
    CoreModule,
    IdentityRoutingModule,
    NgbNavModule,
    ThemeSharedModule,
    UiExtensionsModule,
    NgbDropdownModule,
    PermissionManagementModule,
    NgxValidateCoreModule,
  ],
})
export class UserDepartmentModule {
  static forChild(options: IdentityConfigOptions = {}): ModuleWithProviders<UserDepartmentModule> {
    return {
      ngModule: UserDepartmentModule,
      providers: [
        {
          provide: IDENTITY_ENTITY_ACTION_CONTRIBUTORS,
          useValue: options.entityActionContributors,
        },
        {
          provide: IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS,
          useValue: options.toolbarActionContributors,
        },
        {
          provide: IDENTITY_ENTITY_PROP_CONTRIBUTORS,
          useValue: options.entityPropContributors,
        },
        {
          provide: IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS,
          useValue: options.createFormPropContributors,
        },
        {
          provide: IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS,
          useValue: options.editFormPropContributors,
        },
        IdentityExtensionsGuard, IsAdminGuard
      ],
    };
  }

  static forLazy(options: IdentityConfigOptions = {}): NgModuleFactory<UserDepartmentModule> {
    return new LazyModuleFactory(UserDepartmentModule.forChild(options));
  }
}
