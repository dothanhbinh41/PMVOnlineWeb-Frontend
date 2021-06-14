import { NgModule } from '@angular/core';
import { IsAdminGuard } from '../admin/is-admin-guard';
import { SharedModule } from '../shared/shared.module';
import { TargetRoutingModule } from './target-routing.module';
import { TargetComponent } from './target.component';

@NgModule({
  declarations: [TargetComponent],
  imports: [TargetRoutingModule, SharedModule], 
   providers:[
    IsAdminGuard
  ],
})
export class TargetModule {}
