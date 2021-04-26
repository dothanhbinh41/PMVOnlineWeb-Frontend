import { AuthService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GuideService } from '@proxy/guides';
import { OAuthService } from 'angular-oauth2-oidc';
import toPromise from '../utils/promise-extension';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrls: ['./helps.component.scss'],
})
export class HelpsComponent implements OnInit {
  htmlString;

  constructor(
    private router: Router,
    private oAuthService: OAuthService,
    private authService: AuthService,
    private guideService: GuideService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.hasLoggedIn) {
      this.authService.initLogin();
      return;
    }
    this.loadData();
  }

  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
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
