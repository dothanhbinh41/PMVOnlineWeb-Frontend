import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { DepartmentService, DepartmentUserDto } from '@proxy/departments';
import { TargetService } from '@proxy/targets';
import {
  ActionType,
  CreateTaskRequestDto,
  FullTaskDto,
  MyTaskDto,
  Priority,
  Status,
  TaskCommentDto,
  TaskService,
  UpdateTaskRequestDto,
} from '@proxy/tasks';
import * as moment from 'moment';
import { map, startWith } from 'rxjs/operators';
import { ConfirmDialog } from '../controls/confirm-dialog.component';
import { RejectTaskDialog } from '../controls/reject-task-dialog.component';
import axios from 'axios';
import toPromise from '../utils/promise-extension';
import { PreviewDialog } from '../controls/preview-dialog.component';
import { HistoryDialog } from '../controls/history-dialog.component';
import { FinishTaskDialog } from '../controls/finish-task-dialog.component';
import { RateTaskDialog } from '../controls/rate-task-dialog.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'; 
import { environment } from './../../environments/environment';

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

  additionFiles = [];
  targets = [];
  users = [];
  myTasks = [];
  addMode = false;
  editMode = true;
  loading = false;
  clonedTask: MyTaskDto;
  selectedTarget;
  selectedUser: string;
  purpose = '';
  content = '';
  piority;
  deadline: Date;
  deadlineTime: string;
  selectedCopyTask;
  relatedTasks;
  currentTaskId;
  currentUserId;
  taskDetail: FullTaskDto;
  departments: DepartmentUserDto[];
  taskComments: TaskCommentDto[] = [];
  isShowVerifyTask;
  newMessage = '';
  commentAdditionFiles = [];
  isSubscribe = false;
  rejectReasion;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  //#region init function
  constructor(
    public dialogRef: MatDialogRef<AddTaskComponent>,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private taskService: TaskService,
    private targetService: TargetService,
    private snackBar: MatSnackBar,
    private departmentService: DepartmentService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    if (!data) {
      this.addMode = true;
      this.editMode = false;
      return;
    }
    const { taskId, userId } = data;
    this.currentTaskId = taskId;
    this.currentUserId = userId;
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.loadData();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  displayCloneTask(task: MyTaskDto): string {
    return task ? `#${task.id} ${task.title}` : '';
  }

  async onCloneTaskFieldEnter(event = undefined) {
    if (event) {
      if (event?.keyCode !== 13) return;
    }
    if (typeof this.clonedTask !== 'string') return;
    if (!this.clonedTask || (this.clonedTask as string).trim() === '') return;
    try {
      const clonedTaskId = parseInt((this.clonedTask as string).trim());
      const newClonedTask = this.myTasks.find(d => (d as MyTaskDto).id === clonedTaskId);
      if (newClonedTask) {
        this.trigger?.closePanel();
        this.clonedTask = newClonedTask;
        this.onSelectedClonedTask();
      }
    } catch (error) {}
  }

  onNoClick(isChanged = false): void {
    this.dialogRef.close(isChanged);
  }

  async loadData() {
    this.loading = true;
    let lstInitTasks = [this.loadTarget(), this.loadMyTasks()];
    if (!this.addMode) {
      lstInitTasks = [
        this.getMyDepartment(),
        this.loadRelateTasks(),
        this.loadTaskComments(),
        ...lstInitTasks,
      ];
    }
    await Promise.all(lstInitTasks);
    this.loading = false;
  }

  async loadTarget() {
    const data = (await toPromise(this.targetService.getAllTargets())).items;
    if (!data) {
      this.showMessage('X???y ra l???i, vui l??ng th??? l???i sau.', false);
      this.onNoClick();
      return;
    }
    this.targets = data ? data : [];
  }

  async loadMyTasks() {
    const data = await toPromise(
      this.taskService.searchMyTasksByRequest({ maxResultCount: 100, users: [] })
    );
    this.myTasks = data;
    this.clonedTask = undefined;
    this.trigger?.closePanel();
  }

  async getMyDepartment() {
    const data = await toPromise(this.departmentService.getMyDepartments());
    if (!data) {
      this.showMessage('X???y ra l???i, vui l??ng th??? l???i sau.', false);
      this.onNoClick();
      return;
    }
    this.departments = data;
    this.loadTaskDetail();
  }

  async loadTaskDetail() {
    const data = await toPromise(this.taskService.getTaskById(this.currentTaskId));
    this.rejectReasion = await toPromise(this.taskService.getNoteById(this.currentTaskId));
    if (!data) {
      this.showMessage('X???y ra l???i, vui l??ng th??? l???i sau.', false);
      this.onNoClick();
      return;
    }

    this.taskDetail = data;
    this.purpose = data.title;
    this.content = data.content;
    this.piority = data.priority;
    this.selectedTarget = data.targetId;
    const cloneDate = this.toDate(data.dueDate);
    this.deadline = cloneDate;
    const hour = cloneDate.getHours() < 10 ? `0${cloneDate.getHours()}` : cloneDate.getHours();
    const mins =
      cloneDate.getMinutes() < 10 ? `0${cloneDate.getMinutes()}` : cloneDate.getMinutes();
    this.deadlineTime = `${hour}:${mins}`;
    this.isShowVerifyTask =
      this.departments?.find(d => d.department?.name === 'director') &&
      data.status === Status.Requested;
    await Promise.all([this.loadUser(data.assigneeId), this.loadAdditionFiles()]);
  }

  async loadRelateTasks() {
    const data = await toPromise(this.taskService.getReferenceTasksById(this.currentTaskId));
    if (!data) {
      this.showMessage('X???y ra l???i, vui l??ng th??? l???i sau.', false);
      this.onNoClick();
      return;
    }
    this.relatedTasks = data.map(d => d.id);
  }

  async loadAdditionFiles() {
    const data = await toPromise(this.taskService.getTaskFilesById(this.currentTaskId));
    if (data?.length > 0) {
      this.additionFiles = data;
    }
  }
  async loadUser(selectedUser: string = null) {
    const data = await toPromise(this.taskService.getAllMemberByTarget(this.selectedTarget));
    this.users = data;
    this.selectedUser = selectedUser;
  }
  async loadTaskComments() {
    const data = await toPromise(this.taskService.getTaskCommentsById(this.currentTaskId));
    if (data) {
      this.taskComments = data;
    }
  }
  async commentPickedFile(event: any) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const uploadTasks = files.map(d => this.uploadFile(d));
    this.loading = true;
    const uploadResults = await Promise.all(uploadTasks);
    const uploadDatas = uploadResults.map(d => d.data);
    this.loading = false;
    if (uploadResults) {
      this.commentAdditionFiles = this.commentAdditionFiles.concat(uploadDatas);
    }
  }
  //#endregion

  //#region add task function
  validateData() {
    if (!this.selectedTarget) {
      this.showMessage('Vui l??ng ch???n y??u c???u', false);
      return false;
    }
    if (!this.selectedUser) {
      this.showMessage('Vui l??ng ch???n y??u ?????i t?????ng', false);
      return false;
    }
    if (!this.purpose) {
      this.showMessage('Vui l??ng ??i???n m???c ????ch s??? v???', false);
      return false;
    }
    if (!this.content) {
      this.showMessage('Vui l??ng ??i???n n???i dung s??? v???', false);
      return false;
    }
    if (!this.deadline) {
      this.showMessage('Vui l??ng ch???n th???i h???n cho s??? v???', false);
      return false;
    }
    if (this.deadline)
      if (!this.deadlineTime) {
        this.showMessage('Vui l??ng ch???n th???i h???n cho s??? v???', false);
        return false;
      }
    try {
      const time = this.deadlineTime.split(':');
      // tslint:disable-next-line:radix
      const hour = parseInt(time[0]);
      // tslint:disable-next-line:radix
      const min = parseInt(time[1]);
    } catch (error) {
      this.showMessage('Vui l??ng ch???n th???i h???n h???p l??? cho s??? v???', false);
      return false;
    }

    if (this.piority === undefined) {
      this.showMessage('Vui l??ng ch???n m???c ????? ??u ti??n cho s??? v???', false);
      return false;
    }
    return true;
  }

  async createTask() {
    if (!this.validateData()) {
      // this.showMessage('Vui l??ng ??i???n ?????y ????? th??ng tin!', false);
      return;
    }

    this.loading = true;
    const time = this.deadlineTime.split(':');
    // tslint:disable-next-line:radix
    const hour = parseInt(time[0]);
    // tslint:disable-next-line:radix
    const min = parseInt(time[1]);
    this.deadline.setHours(hour);
    this.deadline.setMinutes(min);

    const dto: CreateTaskRequestDto = {
      title: this.purpose,
      files: this.additionFiles
        ? this.additionFiles.map(d => {
            const { id } = d;
            return id;
          })
        : [],
      priority: this.piority as Priority,
      targetId: this.selectedTarget,
      content: this.content,
      assigneeId: this.selectedUser,
      dueDate: this.deadline,
      referenceTasks: this.relatedTasks ? this.relatedTasks : [],
    };

    const data = await toPromise(this.taskService.createTaskByRequest(dto));
    this.loading = false;
    if (!data) {
      this.showMessage('T???o s??? v??? th???t b???i!', false);
      return;
    }
    this.showMessage('T???o s??? v??? th??nh c??ng!', true);
    this.onNoClick(true);
  }

  async pickedFile(event: any) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const uploadTasks = files.map(d => this.uploadFile(d));
    this.loading = true;
    const uploadResults = await Promise.all(uploadTasks);
    const uploadDatas = uploadResults.map(d => d.data);
    this.loading = false;
    if (uploadResults) {
      this.additionFiles = this.additionFiles.concat(uploadDatas);
    }
  }

  getFilePath(file) {
    return this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

  deleteAdditionFile(index) {
    if (!this.isEmptyAddition) {
      return;
    }
    this.additionFiles.splice(index, 1);
  }

  async onSelectedTargetChagne() {
    this.users = [];
    this.loading = true;
    await this.loadUser();
    this.loading = false;
  }

  async onSelectedClonedTask() {
    if (typeof this.clonedTask === 'string') return;
    this.loading = true;
    const data = await toPromise(this.taskService.getTaskById(this.clonedTask.id));
    this.loading = false;
    if (!data) {
      this.clonedTask = undefined;
      this.showMessage('X???y ra l???i, vui l??ng th??? l???i sau.', false);
      return;
    }
    this.purpose = data.title;
    this.content = data.content;
    this.piority = data.priority;
    this.selectedTarget = data.targetId;
    await this.loadUser(data.assigneeId);
    const cloneDate = this.toDate(data.dueDate);
    this.deadline = cloneDate;
    const hour = cloneDate.getHours() < 10 ? `0${cloneDate.getHours()}` : cloneDate.getHours();
    const mins =
      cloneDate.getMinutes() < 10 ? `0${cloneDate.getMinutes()}` : cloneDate.getMinutes();
    this.deadlineTime = `${hour}:${mins}`;
  }

  toDate(dateString: string) {
    const date = moment.utc(dateString).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date);
    return stillUtc.toDate();
  }


  
  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }; 
    return axios.post(environment.apis.default.url+'/api/File/UploadFile', formData, config);
  }
  //#endregion

  //#region task detail function
  downloadString(id: string) {
    return environment.apis.default.url+`/api/File/DownloadFile?id=${id}`;
  }

  dowloadFile(url: string) {
    window.open(url);
  }

  async updateTask() {
    if (!this.validateData()) {
      // this.showMessage('Vui l??ng ??i???n ?????y ????? th??ng tin!', false);
      return;
    }

    this.loading = true;
    const time = this.deadlineTime.split(':');
    // tslint:disable-next-line:radix
    const hour = parseInt(time[0]);
    // tslint:disable-next-line:radix
    const min = parseInt(time[1]);
    this.deadline.setHours(hour);
    this.deadline.setMinutes(min);

    const dto: UpdateTaskRequestDto = {
      id: this.currentTaskId,
      title: this.purpose,
      files: this.additionFiles
        ? this.additionFiles.map(d => {
            const { id } = d;
            return id;
          })
        : [],
      priority: this.piority as Priority,
      targetId: this.selectedTarget,
      content: this.content,
      assigneeId: this.selectedUser,
      dueDate: this.deadline,
      referenceTasks: this.relatedTasks ? this.relatedTasks : [],
    };

    const data = await toPromise(this.taskService.updateTaskByRequest(dto));
    this.loading = false;
    if (!data) {
      this.showMessage('C???p nh???t s??? v??? th???t b???i!', false);
      return;
    }
    this.showMessage('C???p nh???t s??? v??? th??nh c??ng!', true);
    this.onNoClick(true);
  }

  requireTask() {
    this.showConfirm(
      `B???n mu???n ${this.requireButtonTitle.toLowerCase()} s??? v??? kh??ng?`,
      'C??',
      'Kh??ng',
      rs => {
        if (rs) {
          this.requireConfirmTask();
        }
      }
    );
  }

  async requireConfirmTask() {
    this.loading = true;
    const data = await toPromise(this.taskService.requestTaskByRequest({ id: this.taskDetail.id }));
    this.loading = false;
    if (!data) {
      this.showMessage('Y??u c???u duy???t th???t b???i!', false);
      return;
    }
    this.showMessage('Y??u c???u duy???t th??nh c??ng!', true);
    this.onNoClick();
  }

  finishTask() {
    const dialogRef = this.dialog.open(FinishTaskDialog, {
      disableClose: true,
      data: {
        taskId: this.currentTaskId,
      },
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const time = result.time.split(':');
        const hour = parseInt(time[0]);
        const min = parseInt(time[1]);
        const date = result.date;
        date.setHours(hour);
        date.setMinutes(min);
        this.loading = true;
        const finishResult = await toPromise(
          this.taskService.finishTaskByRequest({
            completed: result.isComplete,
            completedDate: date,
            id: this.currentTaskId,
            note: result.note,
          })
        );
        this.loading = false;
        if (!finishResult) {
          this.showMessage('K???t th??c s??? v??? th???t b???i', false);
          return;
        }
        this.showMessage('K???t th??c s??? v??? th??nh c??ng', true);
        this.onNoClick();
      }
    });
  }

  confirmTask(isConfirm: boolean) {
    if (isConfirm) {
      this.processTask(true, '');
      return;
    }
    const confirmRef = this.dialog.open(RejectTaskDialog, {
      disableClose: true,
      data: {
        message: `Vui l??ng ??i???n l?? do kh??ng duy???t s??? v??? n??y?`,
        buttonText: {
          ok: '?????ng ??',
          cancel: 'H???y',
        },
      },
    });
    confirmRef.afterClosed().subscribe(result => {
      if (!result?.isReject) {
        return;
      }
      this.processTask(false, result.note);
    });
  }

  async processTask(approved: boolean, note: string) {
    if (!approved && !note) {
      return;
    }
    this.loading = true;
    const data = await toPromise(
      this.taskService.processTaskByRequest({
        id: this.taskDetail.id,
        approved,
        note,
      })
    );
    this.loading = false;
    if (!data) {
      this.showMessage('Duy???t th???t b???i!', false);
      return;
    }
    this.showMessage('Duy???t th??nh c??ng!', true);
    this.onNoClick();
  }

  get requireButtonTitle() {
    return this.taskDetail?.status === Status.Pending ? 'Y??u c???u duy???t' : 'K???t th??c';
  }

  get isEmptyAddition() {
    return this.additionFiles && this.additionFiles.length > 0;
  }

  get isNotEmptyCommentAddition() {
    return this.commentAdditionFiles && this.commentAdditionFiles.length > 0;
  }

  get pageTitle() {
    return this.addMode ? 'Th??m S??? V???' : 'Chi Ti???t S??? V???';
  }

  deleteCommentAdditionFile(index) {
    if (!this.isNotEmptyCommentAddition) {
      return;
    }
    this.commentAdditionFiles.splice(index, 1);
  }

  rateTask() {
    const dialogRef = this.dialog.open(RateTaskDialog, {
      disableClose: true,
      data: {
        taskId: this.currentTaskId,
      },
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const { note, rate } = result;
        this.loading = true;
        const isRateResult = await toPromise(
          this.taskService.rateTask(this.currentTaskId, { rating: rate })
        );
        this.loading = false;
        if (!isRateResult) {
          this.showMessage('????nh gi?? s??? v??? th???t b???i!', false);
          return;
        }
        this.showMessage('????nh gi?? s??? v??? th??nh c??ng!', true);
        this.onNoClick(true);
      } else {
        this.onNoClick(true);
      }
    });
  }

  async deleteTask() {
    if (!this.taskDetail || this.taskDetail.status !== Status.Pending) return;
    this.showConfirm(
      `B???n mu???n ${this.requireButtonTitle.toLowerCase()} s??? v??? kh??ng?`,
      'C??',
      'Kh??ng',
      async rs => {
        if (!rs) {
          return;
        }
        const isSuccess = await toPromise(this.taskService.deleteTaskById(this.taskDetail.id));
        if (isSuccess) {
          this.showMessage('X??a s??? v??? th??nh c??ng', true);
          this.onNoClick(true);
          return;
        }
        this.showMessage('X??a s??? v??? th???t b???i', false);
      }
    );
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
  //#endregion

  //#region common function
  async changeSubscribe() {
    this.loading = true;
    const isSuccess = await toPromise(
      this.taskService.followTaskByRequest({ follow: !this.isSubscribe, id: this.currentTaskId })
    );
    this.loading = false;

    if (isSuccess) {
      this.showMessage(`${this.subscribeBtnTitle} th??nh c??ng`, true);
      this.isSubscribe = !this.isSubscribe;
      return;
    }

    this.showMessage(`${this.subscribeBtnTitle} th???t b???i`, false);
  }

  get subscribeBtnTitle() {
    return this.isSubscribe ? 'B??? theo d??i' : 'Theo d??i';
  }

  async sentComment(event = undefined) {
    if (event) {
      if (event?.keyCode !== 13) return;
    }
    if (!this.newMessage?.trim()) return;
    const commentAdditionFileId = this.isNotEmptyCommentAddition
      ? this.commentAdditionFiles.map(d => d.id)
      : [];
    const dto = {
      comment: this.newMessage?.trim(),
      files: commentAdditionFileId,
    };
    this.newMessage = '';
    this.commentAdditionFiles = new Array();
    const result = await toPromise(
      this.taskService.sendCommentByIdAndRequest(this.currentTaskId, dto)
    );
    if (result) this.loadTaskComments();
  }

  showHistory() {
    const dialogRef = this.dialog.open(HistoryDialog, {
      disableClose: true,
      data: {
        taskId: this.currentTaskId,
      },
    });
  }

  async reOpen() {
    this.loading = true;
    const result = await toPromise(
      this.taskService.reopenTaskByRequest({ id: this.currentTaskId })
    );
    if (!result) {
      this.loading = false;
      this.showMessage('M??? l???i s??? v??? th???t b???i!', false);
      return;
    }
    await this.loadTaskDetail();
    this.loading = false;
    this.showMessage('M??? l???i s??? v??? th??nh c??ng!', false);
  }

  convertToLocalTime(time: string) {
    const date = moment.utc(time).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    const local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
    return local;
  }

  showMessage(message, isSuccess) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: isSuccess ? 'notif-success' : 'notif-error',
    });
  }

  showConfirm(message: string, okButton: string, cancelButton: string, callback: any) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      disableClose: true,
      data: {
        message,
        buttonText: {
          ok: okButton,
          cancel: cancelButton,
        },
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        callback(result);
      }
    });
  }

  showPhotoPreview(url: string) {
    this.dialog.open(PreviewDialog, {
      disableClose: false,
      data: {
        url,
      },
    });
  }

  isArrayNullOrEmpty(arr: []) {
    return !arr || arr?.length <= 0;
  }

  get isDirector() {
    return this.departments && this.departments.find(d => d.departmentId === 1 && d.isLeader);
  }
  get canShowDifference() {
    return (
      this.taskDetail &&
      (this.taskDetail.creatorId === this.currentUserId ||
        !(
          this.taskDetail.status > Status.Pending &&
          this.taskDetail.assigneeId === this.currentUserId
        ))
    );
  }
  get canShowReopen() {
    return this.taskDetail && this.taskDetail.status >= 3;
  }
  get canRequestTask() {
    return (
      this.taskDetail &&
      this.taskDetail.status === Status.Pending &&
      this.taskDetail.creatorId === this.currentUserId &&
      this.taskDetail.assigneeId !== this.currentUserId
    );
  }
  get canConfirmRequestTask() {
    return this.isDirector && this.taskDetail && this.taskDetail.status === Status.Requested;
  }
  get canUpdateTask() {
    return this.taskDetail && this.canEditable;
  }
  get canEditable() {
    var rs: boolean =
      this.taskDetail === undefined ||
      (this.taskDetail &&
        ((this.taskDetail.assigneeId === this.currentUserId &&
          this.taskDetail.status === Status.Approved) ||
          (this.taskDetail.creatorId === this.currentUserId &&
            this.taskDetail.status === Status.Pending)));
    return rs;
  }
  get canFinish() {
    return (
      this.taskDetail &&
      this.taskDetail.assigneeId === this.currentUserId &&
      this.taskDetail.status === Status.Approved
    );
  }
  get canRating() {
    return (
      this.taskDetail &&
      this.taskDetail.status >= 4 &&
      this.taskDetail.assigneeId !== this.currentTaskId &&
      this.departments &&
      this.departments.find(d => d.isLeader)
    );
  }
  get canReopen() {
    return (
      this.taskDetail &&
      this.taskDetail.status === Status.Rejected &&
      this.taskDetail.creatorId === this.currentUserId
    );
  }
  get isTaskFinish() {
    return (
      this.taskDetail &&
      (this.taskDetail.status == Status.Completed ||
        this.taskDetail.status == Status.Done ||
        this.taskDetail.status == Status.Incompleted ||
        this.taskDetail.status == Status.LeaderRated ||
        this.taskDetail.status == Status.Rated)
    );
  }
  get canDeleteTask() {
    return (
      this.taskDetail &&
      this.taskDetail.creatorId === this.currentUserId &&
      this.taskDetail.status === Status.Pending
    );
  }
  isPhoto(fileName: string) {
    if (!fileName) return false;
    const photoExtensions = Array.of('.png', '.jpg', '.jpeg', '.gif');
    return photoExtensions.find(d => fileName.indexOf(d) > -1);
  }

  //#endregion
}
