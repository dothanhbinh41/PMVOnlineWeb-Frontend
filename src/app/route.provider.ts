import { RoutesService, eLayoutType } from '@abp/ng.core';
import { eIdentityRouteNames } from '@abp/ng.identity/config';
import { eTenantManagementRouteNames } from '@abp/ng.tenant-management/config';
import { eThemeSharedRouteNames } from '@abp/ng.theme.shared';
import { APP_INITIALIZER } from '@angular/core';
import { DepartmentService } from '@proxy/departments';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routesService: RoutesService) { 
  return () => { 
    routesService.add([
      {
        path: '/',
        name: 'Trang Chủ',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/tasks',
        name: 'Sự Vụ',
        order: 2,
        iconClass: 'fas fa-briefcase',
        layout: eLayoutType.application,
      },
      // {
      //   path: '/admin-setting',
      //   name: 'Quản Lý',
      //   iconClass: 'fas fa-tasks',
      //   order: 3, 
      //   layout: eLayoutType.application,
      // },
      {
        path: '/helps',
        name: 'Hướng Dẫn',
        iconClass: 'fas fa-life-ring',
        order: 4,
        layout: eLayoutType.application,
      },
    ]);

    routesService.remove([eTenantManagementRouteNames.TenantManagement]);
    routesService.remove([eIdentityRouteNames.IdentityManagement]);
  };
}
