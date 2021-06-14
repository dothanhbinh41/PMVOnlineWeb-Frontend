import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { DepartmentService } from "@proxy/departments";
import { UserService } from "@proxy/users";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

 
@Injectable()
export class IsAdminGuard implements CanActivate {

    constructor(private departmentService:DepartmentService) {
    }

     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree{
        return this.departmentService.getMyDepartments().pipe(map(n => n.filter(c=>c.departmentId==1).length>0));
    } 
} 