import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/_services/account.service';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',       title: 'Dashboard',            icon:'nc-chat-33',              class: '' },
    { path: '/users',           title: 'List Users',           icon:'nc-chat-33',              class: '' },
    { path: '/moderator',       title: 'Create Moderator',     icon:'nc-controller-modern',    class: '' },
    { path: '/profile',         title: 'Profile',              icon:'nc-single-02',            class: '' },
    { path: '/logout',          title: 'Log-out',              icon:'nc-spaceship',            class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-moderator-cmp',
    templateUrl: 'sidebar-moderator.component.html',
})

export class SidebarModeratorComponent implements OnInit {
    public menuItems: any[];

    name : string = "";
    avatar: string = "";

    constructor(
        private accountService: AccountService,
    ) { }

    ngOnInit() {
        this.name = this.accountService.userValue.firstname + " " + this.accountService.userValue.lastname;
        this.avatar = this.accountService.userValue.avatar;
        
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
