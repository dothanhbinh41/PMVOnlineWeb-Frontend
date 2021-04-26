import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TargetComponent } from './target.component';

const routes: Routes = [
  { path: '', component: TargetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TargetRoutingModule {}
