import { ABP, DynamicLayoutComponent, ReplaceableComponents, ReplaceableRouteContainerComponent } from '@abp/ng.core';
import { eIdentityComponents, RolesComponent } from '@abp/ng.identity';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/components'; 

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
  },
  // {
  //   path: 'tenant-management',
  //   loadChildren: () =>
  //     import('@abp/ng.tenant-management').then(m => m.TenantManagementModule.forLazy()),
  // },
  {
    path: 'setting-management', 
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
  {
    path: 'user.departments',   
    component: UsersComponent,  
    loadChildren: () =>
      import('./users/identity.module').then(m => m.UserDepartmentModule.forLazy()),
    data: {
      requiredPolicy: 'AbpIdentity.Users', 
    }
  }
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
