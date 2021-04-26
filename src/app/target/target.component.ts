import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { TargetDto, TargetService } from '@proxy/targets';
import { DepartmentDto, DepartmentService } from '@proxy/departments';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
  providers: [ListService],
})
export class TargetComponent implements OnInit {
  target = { items: [], totalCount: 0 } as PagedResultDto<TargetDto>;
  loadingIndicator = true;
  form: FormGroup;

  departments$: Observable<DepartmentDto[]>;

  selectedTarget: TargetDto;

  isModalOpen = false;

  constructor(
    public readonly list: ListService,
    private targetService: TargetService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService
  ) {
    this.departments$ = departmentService.getAllDepartments();
  }

  ngOnInit() {
    const targetStreamCreator = () => this.targetService.getTargets();

    this.list.hookToQuery(targetStreamCreator).subscribe((response: any) => {
      this.target = { items: response, totalCount: response.length };
      this.loadingIndicator = false;
    });
  }

  createTarget() {
    this.selectedTarget = {} as TargetDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  editTarget(id: number) {
    this.selectedTarget = this.target?.items?.find(d => d.id === id);
    this.buildForm();
    this.isModalOpen = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedTarget.name || null, Validators.required],
      departmentId: [this.selectedTarget.departmentId || null, Validators.required],
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedTarget.id
      ? this.targetService.updateTargets(this.selectedTarget.id, this.form.value)
      : this.targetService.addTargets(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }

  delete(id: number) {
    this.confirmation.warn('::AreYouSureToDelete', 'AbpAccount::AreYouSure').subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.targetService.deleteTargets(id).subscribe(() => this.list.get());
      }
    });
  }
}
