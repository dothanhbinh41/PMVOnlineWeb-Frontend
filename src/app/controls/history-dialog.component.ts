import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskActionDto, TaskService } from '@proxy/tasks';
import * as moment from 'moment';
import toPromise from '../utils/promise-extension';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'history-dialog',
  templateUrl: 'history-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class HistoryDialog {
  taskId;
  histories: TaskActionDto[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<HistoryDialog>,
    private taskService: TaskService
  ) {
    if (!data) {
      this.onCancelClick();
      return;
    }
    this.taskId = data.taskId;
    this.loadHistoryById();
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  async loadHistoryById() {
    const data = await toPromise(this.taskService.getTaskHistoryById(this.taskId));
    if (!data || data?.length <= 0) {
      this.onCancelClick();
      return;
    }
    this.histories = data;
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

  convertToLocalTime(time: string) {
    const date = moment.utc(time).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    const local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
    return local;
  }
}
