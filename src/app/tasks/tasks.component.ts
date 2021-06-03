import { AuthService, ProfileService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SimpleUserDto, Status, TaskService } from '@proxy/tasks';
import { OAuthService } from 'angular-oauth2-oidc';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { AddTaskComponent } from '../add-task/add-task.component';
import toPromise from '../utils/promise-extension';

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
  currentUser;

  constructor(
    private oAuthService: OAuthService,
    private authService: AuthService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private userService: ProfileService
  ) {}

  ngOnInit(): void {
    if (!this.hasLoggedIn) {
      this.authService.initLogin();
      return;
    }
    this.fetchData();
    this.fetchCurrentUser();
  }

  async fetchCurrentUser() {
    this.currentUser = await toPromise(this.userService.get());
    console.log(this.currentUser);
  }

  async fetchData() {
    this.loading = true;
    await this.loadTasks();
    await this.loadUsers();
    this.loading = false;
  }

  async loadTasks() {
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
        console.log(data);
        this.tasks = data ? data : [];
      });
  }

  async loadUsers() {
    const lstUsers = await toPromise(this.taskService.getUsersInMyTasks());
    if (!lstUsers || lstUsers.length === 0) return;
    const virtualAll = { id: undefined, name: 'All', surname: undefined } as SimpleUserDto;
    lstUsers.unshift(virtualAll);
    this.users = lstUsers;
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
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '50%',
      minWidth: '512px',
      disableClose: true,
      data: { taskId: item?.id, userId: this.currentUser?.id },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
      }
    });
  }

  addNewTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '50%',
      minWidth: '512px',
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
      }
    });
  }

  convertToLocalTime(time: string) {
    const date = moment.utc(time).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    const local = moment(stillUtc).local().format('HH:mm DD-MM-YYYY');
    return local;
  }

  timeToOutDateState(time: string) {
    const date = moment.utc(time).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date);
    if (moment().utc() >= stillUtc) {
      return 'Quá hạn';
    }
    const diffSec = stillUtc.diff(moment().utc(), 'seconds');
    if (diffSec < 60 * 60) {
      return `Còn: ${stillUtc.diff(moment().utc(), 'day')} phút`;
    }
    if (diffSec < 7 * 24 * 60 * 60) {
      return `Còn: ${stillUtc.diff(moment().utc(), 'hours')} giờ`;
    }
    return `Còn: ${stillUtc.diff(moment().utc(), 'day')} ngày`;
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

  taskStatus(stt) {
    switch (stt) {
      case Status.Approved:
        return 'Duyệt';
      case Status.Completed:
        return 'Hoàn thành';
      case Status.Incompleted:
        return 'Không hoàn thành';
      case Status.Pending:
        return 'Đang chờ';
      case Status.Requested:
        return 'Chờ duyệt';
      case Status.Rejected:
      default:
        return 'Không duyệt';
    }
  }

  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
