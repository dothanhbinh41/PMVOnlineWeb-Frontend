import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '@proxy/tasks';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
  taskDetail;
  loading;
  constructor(
    public dialogRef: MatDialogRef<TaskDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private taskService: TaskService) {
      this.taskDetail = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.taskService
    .getTaskById(this.taskDetail.id)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(data => {
      this.taskDetail = data;
    });
  }
}
