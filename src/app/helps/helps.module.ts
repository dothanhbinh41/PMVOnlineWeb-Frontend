import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HelpsRoutingModule } from './helps-routing.module';
import { HelpsComponent } from './helps.component';

@NgModule({
  declarations: [HelpsComponent],
  imports: [SharedModule, HelpsRoutingModule],
})
export class HelpsModule {}
