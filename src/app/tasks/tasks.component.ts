import { AuthService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
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
    this.taskService
      .searchMyTasksByRequest({ maxResultCount: 20, skipCount: 0 ,users:[] })
      .pipe(finalize(() => {}))
      .subscribe(data => {
        this.tasks = data;
        console.log(data);
      });
  }

  async loadUsers() {
    this.taskService
      .getMyActions()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(data => {
        this.dataSource = data;
        console.log(data);
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

  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
