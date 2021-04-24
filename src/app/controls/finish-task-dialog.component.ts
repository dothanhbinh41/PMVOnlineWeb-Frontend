import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'finish-task-dialog',
  templateUrl: 'finish-task-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class FinishTaskDialog {
  note;
  deadline: Date;
  deadlineTime: string;
  taskId;
  isComplete = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<FinishTaskDialog>
  ) {
    if (data) {
      this.taskId = data.taskId;
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close({
      isComplete: this.isComplete,
      note: this.note,
      time: this.deadlineTime,
      date: this.deadline,
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
