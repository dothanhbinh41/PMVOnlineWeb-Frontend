import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  input: string;
  questionText: string;
  uniqueId: string;

  ngOnInit(): void {}

  constructor(public dialogRef: MatDialogRef<AddTaskComponent>) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  clear() {
    this.input = null;
    this.questionText = null;
    this.uniqueId = null;
  }
}
