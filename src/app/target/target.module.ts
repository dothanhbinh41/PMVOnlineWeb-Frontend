import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TargetRoutingModule } from './target-routing.module';
import { TargetComponent } from './target.component';

@NgModule({
  declarations: [TargetComponent],
  imports: [TargetRoutingModule, SharedModule],
})
export class TargetModule {}
