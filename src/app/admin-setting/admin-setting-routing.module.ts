import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApplicationLayoutComponent } from '@abp/ng.theme.basic';
import { AdminSettingComponent } from '../admin-setting/admin-setting.component';
import { IsAdminGuard } from '../admin/is-admin-guard';

const routes: Routes = [
  { path: '/admin-setting', component: AdminSettingComponent,canActivate:[IsAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[
    IsAdminGuard
  ],

})
export class AdminSettingRoutingModule {}
