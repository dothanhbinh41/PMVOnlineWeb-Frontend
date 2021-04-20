import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
  ngOnInit(): void {}

  constructor(public dialogRef: MatDialogRef<TaskDetailComponent>) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
