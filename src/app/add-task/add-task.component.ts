import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TargetService } from '@proxy/targets';
import { TaskService } from '@proxy/tasks';
import { finalize } from 'rxjs/operators';

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
  loading = false;
  selectedTarget;
  purpose = '';
  content = '';
  piority;
  deadline;
  selectedCopyTask;
  relatedTask;

  ngOnInit(): void {
    this.loadData();
  }

  constructor(
    public dialogRef: MatDialogRef<AddTaskComponent>,
    private domSanitizer: DomSanitizer,
    private taskService: TaskService,
    private targetService: TargetService
  ) {}

  loadData() {
    this.loadTarget();
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

  loadUser() {
    this.taskService
      .getAllMemberByTarget(this.selectedTarget)
      .pipe(finalize(() => {}))
      .subscribe(data => {
        console.log(data);
      });
  }

  clear() {
    this.input = null;
    this.questionText = null;
    this.uniqueId = null;
  }

  pickedFile(event: any) {
    this.additionFiles = event.target.files ? Array.from(event.target.files) : [];
  }

  getFilePath(file) {
    return this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
  }

  deleteAdditionFile(index) {
    if (!this.isEmptyAddition) return;
    this.additionFiles.splice(index, 1);
  }

  onSelectedTargetChagne(){
    this.loadUser();
  }

  get isEmptyAddition() {
    return this.additionFiles && this.additionFiles.length > 0;
  }
}
