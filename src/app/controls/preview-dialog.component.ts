import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'preview-dialog',
  templateUrl: 'preview-dialog.html',
})
export class PreviewDialog {
  url;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<PreviewDialog>
  ) {
    if (data) {
      this.url = data.url;
    }
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }
}
