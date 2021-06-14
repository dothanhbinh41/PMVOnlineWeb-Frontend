import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { IsAdminGuard } from '../admin/is-admin-guard';
import { ReportComponent } from './report.component';

const routes: Routes = [
  { path: '', component: ReportComponent ,canActivate:[IsAdminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
