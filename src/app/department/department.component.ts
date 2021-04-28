import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { DepartmentDto, DepartmentService } from '@proxy/departments';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
  providers: [ListService],
})
export class DepartmentComponent implements OnInit {
  department = { items: [], totalCount: 0 } as PagedResultDto<DepartmentDto>;
  loadingIndicator = true;
  form: FormGroup;

  selectedDepartment: DepartmentDto;

  isModalOpen = false;

  constructor(
    public readonly list: ListService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService
  ) {
  }

  ngOnInit() {
    const departmentStreamCreator = () => this.departmentService.getAllDepartments();

    this.list.hookToQuery(departmentStreamCreator).subscribe((response: PagedResultDto<DepartmentDto>) => {
      this.department = response;
      this.loadingIndicator = false;
    });
  }

  createDepartment() {
    this.selectedDepartment = {} as DepartmentDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  editDepartment(id: number) {
    this.selectedDepartment = this.department?.items?.find(d => d.id === id);
    this.buildForm();
    this.isModalOpen = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedDepartment.name || null, Validators.required],
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedDepartment.id
      ? this.departmentService.updateDepartment(this.selectedDepartment.id, this.form.value)
      : this.departmentService.createDepartment(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }

  delete(id: number) {
    this.confirmation.warn('::AreYouSureToDelete', 'AbpAccount::AreYouSure').subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.departmentService.deleteDepartment(id).subscribe(() => this.list.get());
      }
    });
  }
}
