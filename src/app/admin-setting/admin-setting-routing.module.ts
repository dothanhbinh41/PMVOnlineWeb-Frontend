import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationLayoutComponent } from '@abp/ng.theme.basic';
import { AdminSettingComponent } from '../admin-setting/admin-setting.component';

const routes: Routes = [
  { path: '/admin-setting', component: AdminSettingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminSettingRoutingModule {}
