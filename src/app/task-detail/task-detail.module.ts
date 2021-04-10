import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TaskDetailComponent } from './task-detail.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [TaskDetailComponent],
  imports: [SharedModule, MatDialogModule, MatFormFieldModule],
})
export class TaskDetailModule {}
