import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../shared/shared.module';
import { ConfirmDialog } from './confirm-dialog.component';
import { FilePickerDirective } from './file-picker.directive';
import { FinishTaskDialog } from './finish-task-dialog.component';
import { HistoryDialog } from './history-dialog.component';
import { PreviewDialog } from './preview-dialog.component';
import { RejectTaskDialog } from './reject-task-dialog.component';

@NgModule({
  declarations: [
    FilePickerDirective,
    ConfirmDialog,
    RejectTaskDialog,
    PreviewDialog,
    HistoryDialog,
    FinishTaskDialog,
  ],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule
  ],
})
export class ControlsModule {}
