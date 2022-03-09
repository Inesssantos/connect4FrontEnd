import { Component, OnInit, OnDestroy } from '@angular/core';

import { AccountService } from '../../../_services/account.service';
import { User } from '../../../_models/user';
import { SocketIOService } from 'app/_services/socket.io.services';

@Component({
  selector: 'logout-cmp',
  templateUrl: './logout.component.html',
})

export class LogoutComponent implements OnInit{

  user: User;

    constructor(private accountService: AccountService, private socketIOService: SocketIOService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

  ngOnInit() {
    this.accountService.logout();
    this.socketIOService.leaveRoom("")
  }

}