import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { DepartmentService, DepartmentUserDto } from '@proxy/departments';
import { TargetService } from '@proxy/targets';
import {
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
import { finalize } from 'rxjs/operators';
import { ConfirmDialog } from '../controls/confirm-dialog.component';
import { RejectTaskDialog } from '../controls/reject-task-dialog.component';
import axios, { AxiosResponse } from 'axios';
import toPromise from '../utils/promise-extension';
import { PreviewDialog } from '../controls/preview-dialog.component';
import { HistoryDialog } from '../controls/history-dialog.component';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
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
  taskDetail: FullTaskDto;
  departments: DepartmentUserDto[];
  taskComments: TaskCommentDto[] = [];
  isShowVerifyTask;
  newMessage = '';
  commentAdditionFiles = [];

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
    }
    this.currentTaskId = data;
  }

  ngOnInit(): void {
    this.loadData();
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
    const data = await toPromise(this.targetService.getAllTargets());
    if (!data) {
      this.showMessage('Xảy ra lỗi, vui lòng thử lại sau.', false);
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
  }

  async getMyDepartment() {
    const data = await toPromise(this.departmentService.getMyDepartments());
    if (!data) {
      this.showMessage('Xảy ra lỗi, vui lòng thử lại sau.', false);
      this.onNoClick();
      return;
    }
    this.departments = data;
    this.loadTaskDetail();
  }

  async loadTaskDetail() {
    const data = await toPromise(this.taskService.getTaskById(this.currentTaskId));
    if (!data) {
      this.showMessage('Xảy ra lỗi, vui lòng thử lại sau.', false);
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
      this.showMessage('Xảy ra lỗi, vui lòng thử lại sau.', false);
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
    if (!this.purpose) {
      return false;
    }
    if (!this.content) {
      return false;
    }
    if (!this.selectedTarget) {
      return false;
    }
    if (!this.selectedUser) {
      return false;
    }
    if (!this.deadline) {
      return false;
    }
    if (!this.deadlineTime) {
      return false;
    }
    if (!this.piority) {
      return false;
    }
    return true;
  }

  async createTask() {
    if (!this.validateData()) {
      this.showMessage('Vui lòng điền đầy đủ thông tin!', false);
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
      this.showMessage('Tạo sự vụ thất bại!', false);
      return;
    }
    this.showMessage('Tạo sự vụ thành công!', true);
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
    this.loading = true;
    const data = await toPromise(this.taskService.getTaskById(this.clonedTask.id));
    this.loading = false;
    if (!data) {
      this.clonedTask = undefined;
      this.showMessage('Xảy ra lỗi, vui lòng thử lại sau.', false);
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
    return axios.post('https://pmvonline.azurewebsites.net/api/File/UploadFile', formData, config);
  }
  //#endregion

  //#region task detail function
  downloadString(id: string) {
    return `https://pmvonline.azurewebsites.net/api/File/DownloadFile?id=${id}`;
  }
  async updateTask() {
    if (!this.validateData()) {
      this.showMessage('Vui lòng điền đầy đủ thông tin!', false);
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
      this.showMessage('Cập nhật sự vụ thất bại!', false);
      return;
    }
    this.showMessage('Cập nhật sự vụ thành công!', true);
    this.onNoClick(true);
  }

  requireTask() {
    this.showConfirm(
      `Bạn muốn ${this.requireButtonTitle.toLowerCase()} sự vụ không?`,
      'Có',
      'Không',
      rs => {
        if (rs) {
          this.requireConfirmTask();
        }
      }
    );
  }

  async requireConfirmTask() {
    if (this.taskDetail.status === Status.Approved) {
      this.showMessage('Thành công!', true);
      this.onNoClick();
      return;
    }
    this.loading = true;
    const data = await toPromise(this.taskService.requestTaskByRequest({ id: this.taskDetail.id }));
    this.loading = false;
    if (!data) {
      this.showMessage('Yêu cầu duyệt thất bại!', false);
      return;
    }
    this.showMessage('Yêu cầu duyệt thành công!', true);
    this.onNoClick();
  }

  confirmTask(isConfirm: boolean) {
    if (isConfirm) {
      this.processTask(true, '');
      return;
    }
    const confirmRef = this.dialog.open(RejectTaskDialog, {
      disableClose: true,
      data: {
        message: `Vui lòng điền lý do không duyệt sự vụ này?`,
        buttonText: {
          ok: 'Đồng ý',
          cancel: 'Hủy',
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
      this.showMessage('Duyệt thất bại!', false);
      return;
    }
    this.showMessage('Duyệt thành công!', true);
    this.onNoClick();
  }

  get requireButtonTitle() {
    return this.taskDetail?.status === Status.Pending ? 'Yêu cầu duyệt' : 'Kết thúc';
  }

  get isEmptyAddition() {
    return this.additionFiles && this.additionFiles.length > 0;
  }

  get isNotEmptyCommentAddition() {
    return this.commentAdditionFiles && this.commentAdditionFiles.length > 0;
  }

  get pageTitle() {
    return this.addMode ? 'Thêm Sự Vụ' : 'Chi Tiết Sự Vụ';
  }

  deleteCommentAdditionFile(index) {
    if (!this.isNotEmptyCommentAddition) {
      return;
    }
    this.commentAdditionFiles.splice(index, 1);
  }
  //#endregion

  //#region common function
  unsubscribe() {}

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

  reOpen() {}

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

  get canEditable() {
    return this.addMode || this.taskDetail?.status == Status.Pending;
  }
  //#endregion
}
