import { ReplaceableComponentsService } from '@abp/ng.core'; 
import { eIdentityComponents } from '@abp/ng.identity';
import { PageToolbarComponent } from '@abp/ng.theme.shared/extensions';
import { Component } from '@angular/core';
import { UsersComponent } from './users/components'; 

@Component({
  selector: 'app-root',
  template: `
    <abp-loader-bar></abp-loader-bar>
    <abp-dynamic-layout></abp-dynamic-layout>
  `,
})
export class AppComponent { 
  constructor(
    private replaceableComponents: ReplaceableComponentsService, // injected the service
  ) { 
    this.replaceableComponents.add({
      component: UsersComponent,
      key: eIdentityComponents.Users,
    });
  }
}
