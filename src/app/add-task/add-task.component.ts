import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  ngOnInit(): void {}

  constructor(public dialogRef: MatDialogRef<AddTaskComponent>) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
