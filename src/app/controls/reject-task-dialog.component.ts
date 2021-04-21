import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'reject-task-dialog',
  templateUrl: 'reject-task-dialog.html',
})
export class RejectTaskDialog {
  message: string = 'Are you sure?';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';
  note;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RejectTaskDialog>
  ) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close({ isReject: true, note: this.note });
  }

  onCancelClick() {
    this.dialogRef.close({ isReject: false, note: this.note });
  }
}
