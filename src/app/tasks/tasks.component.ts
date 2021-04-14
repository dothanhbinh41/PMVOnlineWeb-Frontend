import { AuthService } from '@abp/ng.core';
import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TaskService } from '@proxy/tasks';
import { OAuthService } from 'angular-oauth2-oidc';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  loading = false;
  dataSource = [];
  users = [];
  tasks = [];
  selectedUser;
  startDate;
  endDate;
  dateRange;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private router: Router,
    private oAuthService: OAuthService,
    private authService: AuthService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.hasLoggedIn) {
      this.authService.initLogin();
      return;
    }
    this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    await this.loadTasks();
    await this.loadUsers();
    this.loading = false;
  }

  async loadTasks() {
    console.log(this.selectedUser);
    this.taskService
      .searchMyTasksByRequest({
        maxResultCount: 1000,
        skipCount: 0,
        users: this.selectedUser ? [this.selectedUser] : [],
        endDate: this.range?.value?.end,
        startDate: this.range?.value?.start,
      })
      .pipe(finalize(() => {}))
      .subscribe(data => {
        this.tasks = data;
      });
  }

  async loadUsers() {
    this.taskService
      .getUsersInMyTasks()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(data => {
        this.users = ['Nghia', 'Binh', 'Ha'];
      });
  }

  toAction(actionType: number) {
    switch (actionType) {
      case 2:
        return 'đã duyệt sự vụ';
      case 7:
        return 'thay đổi người phụ trách';
      case 4:
        return 'bình luận';
      case 5:
        return 'hoàn thành sự vụ';
      case 0:
        return 'yêu cầu giải quyết sự vụ';
      case 9:
        return 'theo dõi sự vụ';
      case 6:
        return 'không hoàn thành sự vụ';
      case 3:
        return 'không duyệt sự vụ';
      case 8:
        return 'mở lại sự vụ';
      case 10:
        return 'bỏ theo dõi sự vụ';
      case 1:
        return 'yêu cầu duyệt sự vụ';
      default:
        return '';
    }
  }

  showDetail(item: any) {
    console.log(item);
  }

  addNewTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  convertToLocalTime(time: string) {
    const date = moment.utc(time).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    const local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
    return local;
  }

  timeToOutDateState(time: string) {
    const date = moment.utc(time).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date);
    return moment().utc() > stillUtc ? 'Quá hạn' : '';
  }

  resetFilter() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedUser = undefined;
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
    this.loadTasks();
  }

  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
