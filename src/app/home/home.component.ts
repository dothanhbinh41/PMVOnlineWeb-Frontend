import { AuthService, ProfileService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '@proxy/tasks';
import { OAuthService } from 'angular-oauth2-oidc';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { AddTaskComponent } from '../add-task/add-task.component';
import toPromise from '../utils/promise-extension';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loading = false;
  dataSource = [];
  currentUser;

  constructor(
    private oAuthService: OAuthService,
    private authService: AuthService,
    private taskService: TaskService,
    public dialog: MatDialog,
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

  fetchData(): void {
    this.loading = true;
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

  async fetchCurrentUser() {
    this.currentUser = await toPromise(this.userService.get());
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
      return `Còn: ${stillUtc.diff(moment().utc(), 'minutes')} phút`;
    }
    if (diffSec < 7 * 24 * 60 * 60) {
      return `Còn: ${stillUtc.diff(moment().utc(), 'hours')} giờ`;
    }
    return `Còn: ${stillUtc.diff(moment().utc(), 'day')} ngày`;
  }

  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
