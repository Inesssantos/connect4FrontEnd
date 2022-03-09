import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '../_services/account.service';
import { Roles } from './roles';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.accountService.userValue;
        
        if(!user){
            this.router.navigate(['/login']);
            return false;
        }

        //this.accountService.getToken(user.id);

        if(user.role != Roles.Player){
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/login']);
            return false;
        }else {
            // logged in so return true
            return true;
        }

    }
}