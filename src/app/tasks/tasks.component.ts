import { AuthService, ProfileService, RoutesService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from '@proxy/departments';
import { SimpleUserDto, Status, TaskService } from '@proxy/tasks';
import { OAuthService } from 'angular-oauth2-oidc';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { AddTaskComponent } from '../add-task/add-task.component';
import { AuthBase } from '../base.component';
import toPromise from '../utils/promise-extension';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent extends AuthBase {
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
  piority;

  constructor(
    oAuthService: OAuthService,
    authService: AuthService,
    departmentService: DepartmentService,
    routesService: RoutesService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private userService: ProfileService
  ) {super(oAuthService, authService,departmentService,routesService)}

  ngOnInit(): void {
    super.ngOnInit();   
    if (!super.hasLoggedIn) {
      return
    }
    this.fetchData();
    this.fetchCurrentUser();
  }

  async fetchCurrentUser() {
    this.currentUser = await toPromise(this.userService.get());
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
        priority: this.piority,
      })
      .pipe(finalize(() => {}))
      .subscribe(data => {
        this.tasks = data ? data : [];
      });
  }

  async loadUsers() {
    const lstUsers = await toPromise(this.taskService.getUsersInMyTasks());
    if (!lstUsers || lstUsers.length === 0) return;
    const virtualAll = { id: undefined, name: 'T???t c???', surname: undefined } as SimpleUserDto;
    lstUsers.unshift(virtualAll);
    this.users = lstUsers;
  }

  toAction(actionType: number) {
    switch (actionType) {
      case 2:
        return '???? duy???t s??? v???';
      case 7:
        return 'thay ?????i ng?????i ph??? tr??ch';
      case 4:
        return 'b??nh lu???n';
      case 5:
        return 'ho??n th??nh s??? v???';
      case 0:
        return 'y??u c???u gi???i quy???t s??? v???';
      case 9:
        return 'theo d??i s??? v???';
      case 6:
        return 'kh??ng ho??n th??nh s??? v???';
      case 3:
        return 'kh??ng duy???t s??? v???';
      case 8:
        return 'm??? l???i s??? v???';
      case 10:
        return 'b??? theo d??i s??? v???';
      case 1:
        return 'y??u c???u duy???t s??? v???';
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
      return 'Qu?? h???n';
    }
    const diffSec = stillUtc.diff(moment().utc(), 'seconds');
    if (diffSec < 60 * 60) {
      return `C??n: ${stillUtc.diff(moment().utc(), 'day')} ph??t`;
    }
    if (diffSec < 7 * 24 * 60 * 60) {
      return `C??n: ${stillUtc.diff(moment().utc(), 'hours')} gi???`;
    }
    return `C??n: ${stillUtc.diff(moment().utc(), 'day')} ng??y`;
  }

  resetFilter() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedUser = undefined;
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
    this.piority = undefined;
    this.loadTasks();
  }

  taskStatus(stt) {
    if (stt === undefined) return '';
    switch (stt) {
      case Status.Pending:
        return '(??ang ch???)';
      case Status.Requested:
        return '(Ch??? duy???t)';
      case Status.Approved:
        return '(???? duy???t)';
      case Status.Rejected:
        return '(T??? ch???i duy???t)';
      case Status.Completed:
        return '(Ho??n th??nh)';
      case Status.Incompleted:
        return '(Kh??ng ho??n th??nh)';
      case Status.LeaderRated:
      case Status.Rated:
        return '(???? ????nh gi??)';
      case Status.Done:
        return '(???? k???t th??c)';
      default:
        return '';
    }
  } 
}
