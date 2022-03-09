import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { ROUTES } from '../sidebar-player/sidebar-player.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../../../_services/account.service';
import { NotificationService } from 'app/_services/notification.service';
import { SocketIOService } from 'app/_services/socket.io.services';

import { MyNotification } from 'app/_models/notification';

@Component({
  moduleId: module.id,
  selector: 'navbar-player-cmp',
  templateUrl: 'navbar-player.component.html'
})

export class NavbarPlayerComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;

  public isCollapsed = true;

  @ViewChild('search') search: ElementRef;

  @ViewChild("navbar-player-cmp", { static: false }) button;

  notifications: Array<MyNotification> = new Array;

  constructor(location: Location, private formBuilder: FormBuilder, private element: ElementRef, private router: Router, private accountService: AccountService, private notifyService: NotificationService, private socketIOService: SocketIOService) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });


    this.socketIOService.joinToRoom(this.accountService.userValue.id, "");

    this.socketIOService.receiveNotification().subscribe((notification: MyNotification) => {
      this.notifyService.showNotification(notification)
      this.notifications.push(notification)
    });
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Unknown';
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    html.classList.add('nav-open');
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }
    this.sidebarVisible = true;
  };
  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = '';
      }, 500);
    }
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };
  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    console.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }

  onSubmitNavbar() {
    const value = this.search.nativeElement.value
    if (value) {
      ;
      this.router.navigate(['/search'], { queryParams: { search: value } });
      this.search.nativeElement.value = "";
    }
  }

  deleteNotification(id: number){
    this.notifications.splice(id,1)
  }

}
