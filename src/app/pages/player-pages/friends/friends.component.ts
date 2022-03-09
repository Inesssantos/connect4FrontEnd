import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { FriendService } from 'app/_services/friend.service';
import { AccountService } from 'app/_services/account.service';
import { SocketIOService } from 'app/_services/socket.io.services';

import { MyNotification } from 'app/_models/notification';

@Component({
    selector: 'friends-cmp',
    templateUrl: './friends.component.html',
})

export class FriendsComponent implements OnInit {
    friends = [];
    requestsSend = [];
    requestsReceived = [];

    id: string;

    notification: MyNotification = new MyNotification;
    notificationMessages: string[] = ['canceled friend request', 'accepted the friend request', 'refused the friend request', 'removed you from your friends list'];

    filters =
        [
            { id: 1, type: "Name" },
            { id: 2, type: "Username" },
            { id: 3, type: "Wins" },
            { id: 4, type: "Losses" },
        ];
    filterDirection: boolean = true;
    lastFilter: number = -1;

    constructor(private router: Router, private accountService: AccountService, private friendService: FriendService, private socketIOService: SocketIOService) { }

    ngOnInit() {
        this.id = this.accountService.userValue.id;

        this.loadData();

        this.socketIOService.receiveNotification().subscribe(notification => {
            this.loadData();
        });
    }

    loadData() {
        this.friendService.getFriends(this.id)
            .pipe(first())
            .subscribe(x => { this.friends = x; });

        this.friendService.getRequestsFriendsSend(this.id)
            .pipe(first())
            .subscribe(x => { this.requestsSend = x; });

        this.friendService.getRequestsFriendsReceived(this.id)
            .pipe(first())
            .subscribe(x => { this.requestsReceived = x; });
    }

    cancelRequest(friendId: string) {
        this.sendNotification(0, friendId)
        this.friendService.cancelRequestFriend(this.id, friendId).pipe(first())
            .subscribe({
                next: () => {
                    this.reloadComponent();
                }
            });
    }

    acceptFriend(friendId: string) {
        this.sendNotification(1, friendId)
        this.friendService.acceptFriend(this.id, friendId).pipe(first())
            .subscribe({
                next: () => {
                    this.reloadComponent();
                }
            });
    }

    refuseFriend(friendId: string) {
        this.sendNotification(2, friendId)
        this.friendService.denyFriend(this.id, friendId).pipe(first())
            .subscribe({
                next: () => {
                    this.reloadComponent();
                }
            });
    }

    removeFriend(friendId: string) {
        this.sendNotification(3, friendId)
        this.friendService.removeFriend(this.id, friendId).pipe(first())
            .subscribe({
                next: () => {
                    this.reloadComponent();
                }
            });
    }

    filterResults(type: number) {
        if (type <= this.filters.length && type >= 0) {
            this.lastFilter = type;
            switch (type) {
                case 1:
                    if (this.filterDirection) {
                        this.friends.sort(function (a, b) {
                            var nameA = a.firstname.toLowerCase() + " " + a.lastname.toLowerCase()
                            var nameB = b.firstname.toLowerCase() + " " + b.lastname.toLowerCase()

                            if (nameA < nameB) //sort string ascending
                                return -1
                            if (nameA > nameB)
                                return 1
                            return 0 //default return value (no sorting)
                        })
                    }
                    else {
                        this.friends.sort(function (a, b) {
                            var nameA = a.firstname.toLowerCase() + " " + a.lastname.toLowerCase()
                            var nameB = b.firstname.toLowerCase() + " " + b.lastname.toLowerCase()

                            console.log("aqui")
                            if (nameA > nameB) //sort string descending
                                return -1
                            if (nameA < nameB)
                                return 1
                            return 0 //default return value (no sorting)
                        })
                    }

                    break;

                case 2:
                    if (this.filterDirection) {
                        this.friends.sort(function (a, b) {
                            var nameA = a.username.toLowerCase(), nameB = b.username.toLowerCase()
                            if (nameA < nameB) //sort string ascending
                                return -1
                            if (nameA > nameB)
                                return 1
                            return 0 //default return value (no sorting)
                        })
                    }
                    else {
                        this.friends.sort(function (a, b) {
                            var nameA = a.username.toLowerCase(), nameB = b.username.toLowerCase()
                            if (nameA > nameB) //sort string descending
                                return -1
                            if (nameA < nameB)
                                return 1
                            return 0
                        })
                    }

                    break;

                case 3:
                    if (this.filterDirection) {
                        this.friends.sort(function (a, b) {
                            var x = a.wins, y = b.wins
                            if (x < y) //sort string ascending
                                return -1
                            if (x > y)
                                return 1
                            return 0
                        })
                    }
                    else {
                        this.friends.sort(function (a, b) {
                            var x = a.wins, y = b.wins
                            if (x > y) //sort string descending
                                return -1
                            if (x < y)
                                return 1
                            return 0
                        })
                    }

                    break;

                case 4:
                    if (this.filterDirection) {
                        this.friends.sort(function (a, b) {
                            var x = a.losses, y = b.losses
                            if (x < y) //sort string ascending
                                return -1
                            if (x > y)
                                return 1
                            return 0
                        })
                    }
                    else {
                        this.friends.sort(function (a, b) {
                            var x = a.losses, y = b.losses
                            if (x > y) //sort string descending
                                return -1
                            if (x < y)
                                return 1
                            return 0
                        })
                    }
                    break;
            }
        }
    }

    filterType() {
        this.filterDirection = !this.filterDirection
        this.filterResults(this.lastFilter)
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

    sendNotification(type: number, friendId: string) {
        this.notification.from = this.id;
        this.notification.to = friendId;
        this.notification.title = "Friend Requests";
        this.notification.message = this.accountService.userValue.firstname + " " + this.accountService.userValue.lastname + " " + this.notificationMessages[type];
        this.notification.position = 2
        switch (type) {
            case 0:
                this.notification.type = 2
            break;
            case 1:
                this.notification.type = 1
            break; 
            case 2:
                this.notification.type = 2
            break; 
            case 3:
                this.notification.type = 4
            break; 
        }
        this.notification.createdAt = new Date()

        this.socketIOService.sendNotification(this.notification);
    }
}
