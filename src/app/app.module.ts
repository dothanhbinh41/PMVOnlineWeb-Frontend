import { CoreModule } from '@abp/ng.core';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import {
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';

import { registerLocale } from '@abp/ng.core/locale';
import { PermissionManagementModule } from '@abp/ng.permission-management';
import { IdentityConfigModule } from '@abp/ng.identity/config';
import { SettingManagementConfigModule } from '@abp/ng.setting-management/config';
import { TenantManagementConfigModule } from '@abp/ng.tenant-management/config';
import { ThemeBasicModule } from '@abp/ng.theme.basic';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { UiExtensionsModule } from '@abp/ng.theme.shared/extensions';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { SharedModule } from './shared/shared.module';
import { UserDepartmentModule } from './users/identity.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule.forRoot({
      environment,
      registerLocaleFn: registerLocale(),
    }),
    ThemeSharedModule.forRoot(),
    IdentityConfigModule.forRoot(),
    TenantManagementConfigModule.forRoot(),
    SettingManagementConfigModule.forRoot(),
    NgxsModule.forRoot(),
    ThemeBasicModule.forRoot(),
    UiExtensionsModule,
    PermissionManagementModule,
    NgxValidateCoreModule,
    SharedModule,
    NgbNavModule,
    UserDepartmentModule.forChild(),
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule
  ],
  exports: [],
  declarations: [AppComponent],
  providers: [
    APP_ROUTE_PROVIDER,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent],
})
export class AppModule {}
