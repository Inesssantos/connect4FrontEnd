import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/_services/account.service';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/home',            title: 'Home',            icon:'nc-bank',                 class: '' },
    { path: '/chat',            title: 'Chat',            icon:'nc-chat-33',              class: '' },
    { path: '/game',            title: 'Game',            icon:'nc-controller-modern',    class: '' },
    { path: '/friends',         title: 'Friends',         icon:'nc-single-02',            class: '' },
    { path: '/profile-player',  title: 'Profile',         icon:'nc-circle-10',            class: '' },
    { path: '/search',          title: 'Search',          icon:'nc-zoom-split',           class: '' },
    { path: '/logout',          title: 'Log-out',         icon:'nc-spaceship',            class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-player-cmp',
    templateUrl: 'sidebar-player.component.html',
})

export class SidebarPlayerComponent implements OnInit {
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
