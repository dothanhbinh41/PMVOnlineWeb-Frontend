import { AuthService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '@proxy/tasks';
import { OAuthService } from 'angular-oauth2-oidc';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loading = false;
  dataSource = [];
  constructor(
    private router: Router,
    private oAuthService: OAuthService,
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    if (!this.hasLoggedIn) {
      this.authService.initLogin();
      return;
    }
    this.fetchData();
  }

  fetchData(): void {
    this.taskService
      .getMyActions()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(data => {
        this.dataSource = data;
        console.log(data)
      });
  }

  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
