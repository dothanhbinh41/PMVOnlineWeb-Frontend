import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsAdminGuard } from '../admin/is-admin-guard';
import { DepartmentComponent } from './department.component';

const routes: Routes = [
  { path: '', component: DepartmentComponent ,canActivate:[IsAdminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[IsAdminGuard]
})
export class DepartmentRoutingModule {}
