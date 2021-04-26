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
    // this.authors$ = departmentService.getAuthorLookup().pipe(map((r) => r.items));
  }

  ngOnInit() {
    const bookStreamCreator = () => this.departmentService.getDepartments();

    this.list.hookToQuery(bookStreamCreator).subscribe((response: any) => {
      this.department = { items: response, totalCount: response.length };
      console.log(this.department);
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
      // authorId: [this.selectedDepartment.authorId || null, Validators.required],
      name: [this.selectedDepartment.name || null, Validators.required],
      // type: [this.selectedDepartment.type || null, Validators.required],
      // publishDate: [
      //   this.selectedDepartment.publishDate ? new Date(this.selectedDepartment.publishDate) : null,
      //   Validators.required,
      // ],
      // price: [this.selectedDepartment.price || null, Validators.required],
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedDepartment.id
      ? this.departmentService.updateDepartment(this.selectedDepartment.id, this.form.value)
      : this.departmentService.createDepartments(this.form.value);

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
