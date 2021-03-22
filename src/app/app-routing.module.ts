import { ABP, DynamicLayoutComponent, ReplaceableComponents, ReplaceableRouteContainerComponent } from '@abp/ng.core';
import { eIdentityComponents, RolesComponent, UsersComponent } from '@abp/ng.identity';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    path: 'users',
    component: ReplaceableRouteContainerComponent,
    data: {
      requiredPolicy: 'AbpIdentity.Users',
      replaceableComponent: {
        key: eIdentityComponents.Users,
        defaultComponent: UsersComponent,
      } as ReplaceableComponents.RouteData<UsersComponent>,
    },
  }
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
