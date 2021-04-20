import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminSettingRoutingModule } from './admin-setting-routing.module';
import { AdminSettingComponent } from './admin-setting.component';

@NgModule({
  declarations: [AdminSettingComponent],
  imports: [SharedModule, AdminSettingRoutingModule],
})
export class AdminSettingModule {}
