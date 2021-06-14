import { AuthService, eLayoutType, RoutesService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '@proxy/departments';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthBase } from '../base.component';

@Component({
  selector: 'app-admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.scss'],
})
export class AdminSettingComponent extends AuthBase {
    
  constructor(
    oAuthService: OAuthService,
    authService: AuthService,
    departmentService: DepartmentService,
    routesService: RoutesService
  ) {
    super(oAuthService, authService,departmentService,routesService)
  }
}
