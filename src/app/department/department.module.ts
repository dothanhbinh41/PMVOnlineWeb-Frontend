import { NgModule } from '@angular/core'; 
import { IsAdminGuard } from '../admin/is-admin-guard';
import { SharedModule } from '../shared/shared.module';
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';

@NgModule({
  declarations: [DepartmentComponent],
  providers:[
    IsAdminGuard
  ],
  imports: [DepartmentRoutingModule, SharedModule],
})
export class DepartmentModule {}
