// import {
//   ABP,
//   DynamicLayoutComponent,
//   ReplaceableComponents,
//   ReplaceableRouteContainerComponent,
// } from '@abp/ng.core';
// import { eIdentityComponents, RolesComponent } from '@abp/ng.identity';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { AdminSettingComponent } from './admin-setting/admin-setting.component';
import { HelpsComponent } from './helps/helps.component';
import { TasksComponent } from './tasks/tasks.component';
import { UsersComponent } from './users/components';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'admin-setting',
    pathMatch: 'full',
    loadChildren: () =>
      import('./admin-setting/admin-setting.module').then(m => m.AdminSettingModule),
    component: AdminSettingComponent,
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.TenantManagementModule.forLazy()),
  },
  {
    path: 'department-management',
    loadChildren: () =>
      import('./department/department.module').then(m => m.DepartmentModule),
  },
  {
    path: 'target-management',
    loadChildren: () =>
      import('./target/target.module').then(m => m.TargetModule),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
  {
    path: 'user-departments',
    component: UsersComponent,
    loadChildren: () =>
      import('./users/identity.module').then(m => m.UserDepartmentModule.forLazy()),
    data: {
      requiredPolicy: 'AbpIdentity.Users',
    },
  },
  {
    path: 'tasks',
    pathMatch: 'full',
    loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule),
    component: TasksComponent,
  },
  {
    path: 'helps',
    pathMatch: 'full',
    loadChildren: () => import('./helps/helps.module').then(m => m.HelpsModule),
    component: HelpsComponent,
  },
  {
    path: 'add-task',
    pathMatch: 'full',
    loadChildren: () => import('./add-task/add-task.module').then(m => m.AddTaskModule),
    component: AddTaskComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
