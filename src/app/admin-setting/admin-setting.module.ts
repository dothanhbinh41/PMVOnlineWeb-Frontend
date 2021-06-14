import { NgModule } from '@angular/core';
import { IsAdminGuard } from '../admin/is-admin-guard';
import { SharedModule } from '../shared/shared.module';
import { AdminSettingRoutingModule } from './admin-setting-routing.module';
import { AdminSettingComponent } from './admin-setting.component';

@NgModule({
  declarations: [AdminSettingComponent],
  imports: [SharedModule, AdminSettingRoutingModule],
  providers:[IsAdminGuard], 
})
export class AdminSettingModule {}
