import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { TargetService } from '@proxy/targets';
import { CreateTaskRequestDto, FullTaskDto, Priority, TaskService } from '@proxy/tasks';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
  taskId: number;
  taskDetail: FullTaskDto;
  loading;

  additionFiles = [];
  targets = [];
  users = [];
  myTasks = [];
  selectedTarget;
  selectedUser;
  purpose = '';
  content = '';
  piority;
  deadline: Date;
  deadlineTime: string;
  selectedCopyTask;
  relatedTasks;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private domSanitizer: DomSanitizer,
    private taskService: TaskService,
    private targetService: TargetService,
    private snackBar: MatSnackBar
  ) {
    this.taskId = data.id;
  }

  ngOnInit(): void {
    this.taskService
      .getTaskById(this.taskId)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(data => {
        this.taskDetail = data;
      });
  }

  loadData() {
    this.loadTarget();
    this.loadMyTasks();
  }

  loadMyTasks() {
    this.taskService
      .searchMyTasksByRequest({ maxResultCount: 100, users: [] })
      .pipe(finalize(() => {}))
      .subscribe(data => {
        this.myTasks = data;
      });
  }

  loadTarget() {
    this.loading = true;
    this.targetService
      .getAllTargets()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(data => {
        this.targets = data ? data : [];
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadUser(_selectedUser: any = undefined) {
    this.taskService
      .getAllMemberByTarget(this.selectedTarget)
      .pipe(finalize(() => {}))
      .subscribe(data => {
        this.users = data;
        this.selectedUser = _selectedUser;
      });
  }

  validateData() {
    if (!this.purpose) { return false; }
    if (!this.content) { return false; }
    if (!this.selectedTarget) { return false; }
    if (!this.selectedUser) { return false; }
    if (!this.deadline) { return false; }
    if (!this.deadlineTime) { return false; }
    if (!this.piority) { return false; }
    return true;
  }

  createTask() {
    if (!this.validateData()) {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin!', undefined, {
        duration: 2000,
        panelClass: 'notif-error',
      });
      return;
    }
    const time = this.deadlineTime.split(':');
    const hour = parseInt(time[0]);
    const min = parseInt(time[1]);
    this.deadline.setHours(hour);
    this.deadline.setMinutes(min);

    const dto: CreateTaskRequestDto = {
      title: this.purpose,
      files: [],
      priority: this.piority as Priority,
      targetId: this.selectedTarget,
      content: this.content,
      assigneeId: this.selectedUser,
      dueDate: this.deadline,
      referenceTasks: this.relatedTasks ? this.relatedTasks : [],
    };
    this.loading = true;
    this.taskService
      .createTaskByRequest(dto)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(data => {
        if (data) {
          this.snackBar.open('Tạo sự vụ thành công!', undefined, {
            duration: 2000,
            panelClass: 'notif-success',
          });
        }
        this.onNoClick();
      });
  }

  pickedFile(event: any) {
    this.additionFiles = event.target.files ? Array.from(event.target.files) : [];
    this.uploadFile();
  }

  getFilePath(file) {
    return this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

  deleteAdditionFile(index) {
    if (!this.isEmptyAddition) { return; }
    this.additionFiles.splice(index, 1);
  }

  onSelectedTargetChagne() {
    this.users = [];
    this.loadUser();
  }

  toDate(dateString: string) {
    const date = moment.utc(dateString).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date);
    return stillUtc.toDate();
  }
  uploadFile() {}

  get isEmptyAddition() {
    return this.additionFiles && this.additionFiles.length > 0;
  }
}
