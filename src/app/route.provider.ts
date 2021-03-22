import { RoutesService, eLayoutType, ReplaceableRouteContainerComponent, ReplaceableComponents } from '@abp/ng.core';
import { eIdentityComponents, UsersComponent } from '@abp/ng.identity';
import { eIdentityRouteNames } from '@abp/ng.identity/config';
import { eTenantManagementRouteNames } from '@abp/ng.tenant-management/config';
import { eThemeSharedRouteNames } from '@abp/ng.theme.shared';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routesService: RoutesService) {
  return () => {
    routesService.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application
      },
      {
        path: '/your-path',
        name: 'Su vu', 
        order: 2,
        iconClass: 'fas fa-book',
        layout: eLayoutType.application, 
      } ,
      {
        path: '/your-path',
        name: 'Department', 
        parentName: eThemeSharedRouteNames.Administration,
        order: 2, 
        iconClass: 'fas fa-book',
        layout: eLayoutType.application, 
      } ,
      {
        path: 'users',
        name: 'users', 
        parentName: eThemeSharedRouteNames.Administration,
        order: 2, 
        iconClass: 'fas fa-book',
        layout: eLayoutType.application, 
      } 
    ]); 
 
    routesService.remove([eTenantManagementRouteNames.TenantManagement]); 
    routesService.remove([eIdentityRouteNames.IdentityManagement]);
  };
}
