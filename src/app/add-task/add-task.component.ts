import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { TargetService } from '@proxy/targets';
import { CreateTaskRequestDto, MyTaskDto, Priority, TaskService } from '@proxy/tasks';
import * as moment from 'moment';
import { error } from 'node:console';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  input: string;
  questionText: string;
  uniqueId: string;
  additionFiles = [];
  targets = [];
  users = [];
  myTasks = [];

  loading = false;
  clonedTask: MyTaskDto;
  selectedTarget;
  selectedUser;
  purpose = '';
  content = '';
  piority;
  deadline: Date;
  deadlineTime: string;
  selectedCopyTask;
  relatedTasks;

  ngOnInit(): void {
    this.loadData();
  }

  constructor(
    public dialogRef: MatDialogRef<AddTaskComponent>,
    private domSanitizer: DomSanitizer,
    private taskService: TaskService,
    private targetService: TargetService,
    private snackBar: MatSnackBar
  ) {}

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
    if (!this.purpose) return false;
    if (!this.content) return false;
    if (!this.selectedTarget) return false;
    if (!this.selectedUser) return false;
    if (!this.deadline) return false;
    if (!this.deadlineTime) return false;
    if (!this.piority) return false;
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

    var dto: CreateTaskRequestDto = {
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
        if (data)
          this.snackBar.open('Tạo sự vụ thành công!', undefined, {
            duration: 2000,
            panelClass: 'notif-success',
          });
        this.onNoClick();
      });
  }

  clear() {
    this.input = null;
    this.questionText = null;
    this.uniqueId = null;
  }

  pickedFile(event: any) {
    this.additionFiles = event.target.files ? Array.from(event.target.files) : [];
    this.uploadFile();
  }

  getFilePath(file) {
    return this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

  deleteAdditionFile(index) {
    if (!this.isEmptyAddition) return;
    this.additionFiles.splice(index, 1);
  }

  onSelectedTargetChagne() {
    this.users = [];
    this.loadUser();
  }

  onSelectedClonedTask() {
    this.loading = true;
    this.taskService
      .getTaskById(this.clonedTask.id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(data => {
        this.purpose = data.title;
        this.content = data.content;
        this.piority = data.priority;
        this.selectedTarget = data.targetId;
        this.loadUser(data.assigneeId);
        const cloneDate = this.toDate(data.dueDate);
        this.deadline = cloneDate;
        const hour = cloneDate.getHours() < 10 ? `0${cloneDate.getHours()}` : cloneDate.getHours();
        const mins =
          cloneDate.getMinutes() < 10 ? `0${cloneDate.getMinutes()}` : cloneDate.getMinutes();
        this.deadlineTime = `${hour}:${mins}`;
      });
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
