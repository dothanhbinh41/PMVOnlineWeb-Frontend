import { ABP, AuthService, eLayoutType, ProfileService, RoutesService } from '@abp/ng.core';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route } from '@angular/router';
import { DepartmentService } from '@proxy/departments';
import { TaskService } from '@proxy/tasks';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export abstract class AuthBase implements OnInit {

    constructor(
        private oAuthService: OAuthService,
        private authService: AuthService,
        private departmentService: DepartmentService,
        private routesService: RoutesService
    ) { }

    ngOnInit(): void {
        if (!this.hasLoggedIn) {
            this.authService.initLogin();
            this.checkPermission();
            return;
        } this.checkPermission();
    }

    checkPermission() { 
        this.departmentService.getMyDepartments().toPromise().then((c) => {
            var ad = c.filter(d => d.departmentId == 1).length > 0;
            
            var admin = this.routesService.find(d => d.path == '/admin-setting');
            if (ad) { 
                if(admin!=null)
                {
                    return;
                }
                this.routesService.add([{
                    path: '/admin-setting',
                    name: 'Quản Lý',
                    iconClass: 'fas fa-tasks',
                    order: 3,
                    layout: eLayoutType.application,
                },
                {
                    path: 'user-departments',
                    name: 'Quản Lý Users',
                    parentName: 'Quản Lý',
                    order: 3,
                    iconClass: 'fas fa-users',
                    layout: eLayoutType.application,
                },
                {
                    path: 'department-management',
                    name: 'Quản Lý Phòng Ban',
                    parentName: 'Quản Lý',
                    order: 3,
                    iconClass: 'fas fa-building',
                    layout: eLayoutType.application,
                },
                {
                    path: 'target-management',
                    name: 'Quản Lý Mục Tiêu',
                    parentName: 'Quản Lý',
                    order: 3,
                    iconClass: 'fas fa-dot-circle',
                    layout: eLayoutType.application,
                }, {
                    path: 'report-management',
                    name: 'Báo cáo',
                    parentName: 'Quản Lý',
                    order: 3,
                    iconClass: 'fas fa-dot-circle',
                    layout: eLayoutType.application,
                },
                ]); 
            }
            else{ 
                this.routesService.remove(['/admin-setting']);
            } 
            this.routesService.refresh();
        });
    }

    get hasLoggedIn(): boolean {
        return this.oAuthService.hasValidAccessToken();
    }
}
