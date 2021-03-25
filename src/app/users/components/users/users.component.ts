import { ListService } from '@abp/ng.core';
import { ePermissionManagementComponents } from '@abp/ng.permission-management';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import {
  EXTENSIONS_IDENTIFIER,
  FormPropData,
  generateFormFromProps,
} from '@abp/ng.theme.shared/extensions';
import {
  Component,
  Injector,
  OnInit,
  TemplateRef,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { DepartmentDto, DepartmentService, DepartmentUserDto } from '@proxy/departments';
import { Observable } from 'rxjs';
import { finalize, pluck, switchMap, take } from 'rxjs/operators';
import snq from 'snq';
import {
  CreateUser,
  DeleteUser,
  GetUserById,
  GetUserRoles,
  GetUsers,
  UpdateUser,
} from '../../actions/identity.actions';
import { eIdentityComponents } from '../../enums/components';
import { Identity } from '../../models/identity';
import { IdentityUserService } from '../../proxy/identity/identity-user.service';
import { GetIdentityUsersInput, IdentityUserDto } from '../../proxy/identity/models';
import { IdentityState } from '../../states/identity.state';

@Component({
  selector: 'abp-users',
  templateUrl: './users.component.html',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: eIdentityComponents.Users,
    },
  ],
})
export class UsersComponent implements OnInit {
  @Select(IdentityState.getUsers)
  data$: Observable<IdentityUserDto[]>;

  @Select(IdentityState.getUsersTotalCount)
  totalCount$: Observable<number>;

  @ViewChild('modalContent', { static: false })
  modalContent: TemplateRef<any>;

  form: FormGroup;

  selected: IdentityUserDto;

  selectedUserDepartments: DepartmentUserDto[];

  departments: DepartmentDto[];

  visiblePermissions = false;

  providerKey: string;

  isModalVisible: boolean;

  modalBusy = false;

  permissionManagementKey = ePermissionManagementComponents.PermissionManagement;

  trackByFn: TrackByFunction<AbstractControl> = (index, item) => Object.keys(item)[0] || index;

  onVisiblePermissionChange = event => {
    this.visiblePermissions = event;
  };

  get departmentGroups(): FormGroup[] {
    return snq(() => (this.form.get('departments') as FormArray).controls as FormGroup[], []);
  }

  constructor(
    public readonly list: ListService<GetIdentityUsersInput>,
    protected confirmationService: ConfirmationService,
    protected userService: IdentityUserService,
    protected fb: FormBuilder,
    protected store: Store,
    protected injector: Injector,
    protected deparmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.hookToQuery();
  }

  buildForm() {
    const data = new FormPropData(this.injector, this.selected);
    this.form = generateFormFromProps(data);

    this.deparmentService.getAllDepartments().subscribe(allDepartments => {
      this.departments = allDepartments;
      this.form.addControl(
        'departments',
        this.fb.array(
          this.departments.map(department =>
            this.fb.group({
              [department.name]: [
                this.selected.id
                  ? !!snq(() =>
                      this.selectedUserDepartments.find(dep => dep.deparmentId === department.id)
                    )
                  : true
              ],
            })
          )
        )
      );
    });
  }

  openModal() {
    this.buildForm();
    this.isModalVisible = true;
  }

  add() {
    this.selected = {} as IdentityUserDto;
    this.selectedUserDepartments = [] as DepartmentUserDto[];
    this.openModal();
  }

  edit(id: string) {
    this.store
      .dispatch(new GetUserById(id))
      .pipe(
        switchMap(() => this.store.dispatch(new GetUserRoles(id))),
        pluck('IdentityState'),
        take(1)
      )
      .subscribe((state: Identity.State) => {
        this.selected = state.selectedUser;
        this.selectedUserDepartments = state.departments || [];
        this.openModal();
      });
  }

  save() {
    if (!this.form.valid || this.modalBusy) return;
    this.modalBusy = true;

    const { roleNames } = this.form.value;
    const mappedRoleNames = snq(
      () =>
        roleNames.filter(role => !!role[Object.keys(role)[0]]).map(role => Object.keys(role)[0]),
      []
    );

    this.store
      .dispatch(
        this.selected.id
          ? new UpdateUser({
              ...this.selected,
              ...this.form.value,
              id: this.selected.id,
              roleNames: mappedRoleNames,
            })
          : new CreateUser({
              ...this.form.value,
              roleNames: mappedRoleNames,
            })
      )
      .pipe(finalize(() => (this.modalBusy = false)))
      .subscribe(() => {
        this.isModalVisible = false;
        this.list.get();
      });
  }

  delete(id: string, userName: string) {
    this.confirmationService
      .warn('AbpIdentity::UserDeletionConfirmationMessage', 'AbpIdentity::AreYouSure', {
        messageLocalizationParams: [userName],
      })
      .subscribe((status: Confirmation.Status) => {
        if (status === Confirmation.Status.confirm) {
          this.store.dispatch(new DeleteUser(id)).subscribe(() => this.list.get());
        }
      });
  }

  sort(data) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }

  private hookToQuery() {
    this.list.hookToQuery(query => this.store.dispatch(new GetUsers(query))).subscribe();
  }

  openPermissionsModal(providerKey: string) {
    this.providerKey = providerKey;
    setTimeout(() => {
      this.visiblePermissions = true;
    }, 0);
  }
}
