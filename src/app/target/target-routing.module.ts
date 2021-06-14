import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsAdminGuard } from '../admin/is-admin-guard';
import { TargetComponent } from './target.component';

const routes: Routes = [
  { path: '', component: TargetComponent ,canActivate:[IsAdminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TargetRoutingModule {}
