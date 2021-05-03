import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module'; 
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';

@NgModule({
  declarations: [ReportComponent],
  imports: [ReportRoutingModule, SharedModule],
})
export class ReportModule {}
