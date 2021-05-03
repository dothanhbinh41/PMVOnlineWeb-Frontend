import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StarRatingComponent } from 'ng-starrating';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rate-task-dialog',
  templateUrl: 'rate-task-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class RateTaskDialog {
  note;
  rate = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RateTaskDialog>
  ) {}

  onConfirmClick(): void {
    this.dialogRef.close({ note: this.note, rate: this.rate });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onRate($event: { oldValue: number; newValue: number; starRating: StarRatingComponent }) {}
}
