import { AuthService, RoutesService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DepartmentService } from '@proxy/departments';
import { GuideService } from '@proxy/guides';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthBase } from '../base.component';
import toPromise from '../utils/promise-extension';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrls: ['./helps.component.scss'],
})
export class HelpsComponent extends AuthBase {
  htmlString;

  constructor(
    oAuthService: OAuthService,
    authService: AuthService,
    departmentService: DepartmentService,
    routesService: RoutesService,
    private router: Router, 
    private guideService: GuideService,
    private snackBar: MatSnackBar
  ) {super(oAuthService, authService,departmentService,routesService)}

  ngOnInit(): void {
    super.ngOnInit();   
    if (!super.hasLoggedIn) {
      return
    }
    this.loadData();
  }
 
  async loadData() {
    const guide = await toPromise(this.guideService.getGuide());
    this.htmlString = guide?.content;
  }

  async saveGuide() {
    const isSuccess = await toPromise(this.guideService.setGuide({ content: this.htmlString }));
    if (isSuccess) {
      this.showMessage('Lưu hướng dẫn thành công!', true);
      return;
    }
    this.showMessage('Lưu hướng dẫn thất bại!', false);
  }

  showMessage(message, isSuccess) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
      panelClass: isSuccess ? 'notif-success' : 'notif-error',
    });
  }
}
