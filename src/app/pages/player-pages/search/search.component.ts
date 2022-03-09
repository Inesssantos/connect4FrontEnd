import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { FriendService } from '../../../_services/friend.service';
import { AccountService } from '../../../_services/account.service';
import { SocketIOService } from 'app/_services/socket.io.services';

import { MyNotification } from 'app/_models/notification';


@Component({
    selector: 'search-cmp',
    templateUrl: './search.component.html',
})

export class SearchComponent implements OnInit {
    users = [];

    id: string;
    searchValue: string;
    @ViewChild('search') search: ElementRef

    filters =
        [
            { id: 1, type: "Name" },
            { id: 2, type: "Username" },
            { id: 3, type: "First non Friends" },
            { id: 4, type: "First Friend Requests Sent" },
            { id: 5, type: "First Friend Requests Received" },
            { id: 6, type: "First Friends" }
        ];
    filterDirection: boolean = true;
    lastFilter: number = -1;

    notification: MyNotification = new MyNotification;

    notificationMessages: string[] = ['sent a friend request', 'canceled friend request', 'accepted the friend request', 'refused the friend request', 'removed you from your friends list'];

    
    constructor(private router: Router, private activeRoute: ActivatedRoute, private accountService: AccountService, private friendService: FriendService, private socketIOService: SocketIOService) {
    }

    ngOnInit() {
        this.id = this.accountService.userValue.id;

        this.activeRoute.queryParams.subscribe(params => {
            if (params['search']) {
                this.searchValue = params['search'];

                this.router.navigate([], {
                    relativeTo: this.activeRoute,
                    queryParams: {},
                    replaceUrl: true,
                });
                this.onSubmit(this.searchValue);
            }
            else {
                this.friendService.getListUsers(this.id).pipe(first())
                    .subscribe(x => { this.users = x; });
            }
        });

        this.socketIOService.receiveNotification().subscribe(notification => {
            this.friendService.getListUsers(this.id).pipe(first())
                    .subscribe(x => { this.users = x; });
        });
    }

    onSubmit(value: string) {
        if (value) {
            this.searchValue = value;
            this.friendService.searchUser(this.id, this.searchValue)
                .pipe(first())
                .subscribe(x => { this.users = x; });
        }
        else {
            this.searchValue = "";
            this.friendService.getListUsers(this.id).pipe(first())
                .subscribe(x => { this.users = x; });
        }
        this.search.nativeElement.value = this.searchValue
    }

    sendRequest(friendId: string) {
        this.sendNotification(0,friendId)
        this.friendService.sendRequestFriend(this.id, friendId).pipe(first())
            .subscribe({
                next: () => {
                    this.reloadComponent();
                }
            });
    }

    cancelRequest(friendId: string) {
        this.sendNotification(1,friendId)
        this.friendService.cancelRequestFriend(this.id, friendId).pipe(first())
            .subscribe({
                next: () => {
                    this.reloadComponent();
                }
            });
    }

    acceptFriend(friendId: string) {
        this.sendNotification(2,friendId)
        this.friendService.acceptFriend(this.id, friendId).pipe(first())
            .subscribe({
                next: () => {
                    this.reloadComponent();
                }
            });
    }

    refuseFriend(friendId: string) {
        this.sendNotification(3,friendId)
        this.friendService.denyFriend(this.id, friendId).pipe(first())
            .subscribe({
                next: () => {
                    this.reloadComponent();
                }
            });
    }

    removeFriend(friendId: string) {
        this.sendNotification(4,friendId)
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
            let first: number = -1;
            switch (type) {
                case 1:
                    if (this.filterDirection) {
                        this.users.sort(function (a, b) {
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
                        this.users.sort(function (a, b) {
                            var nameA = a.firstname.toLowerCase() + " " + a.lastname.toLowerCase()
                            var nameB = b.firstname.toLowerCase() + " " + b.lastname.toLowerCase()

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
                        this.users.sort(function (a, b) {
                            var nameA = a.username.toLowerCase(), nameB = b.username.toLowerCase()
                            if (nameA < nameB) //sort string ascending
                                return -1
                            if (nameA > nameB)
                                return 1
                            return 0 //default return value (no sorting)
                        })
                    }
                    else {
                        this.users.sort(function (a, b) {
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
                    // [0,1,2,3]
                    first = 0;
                    break;

                case 4:
                    first = 1;
                    break;

                case 5:
                    // [2,0,1,3]
                    first = 2;
                    break;
                case 6:
                    // [3,0,1,2]
                    first = 3;
                    break;
            }

            if (first != -1) {
                this.users.sort(function (a, b) {
                    var x = a.friend, y = b.friend
                    if (x == first) {
                        return -1;
                    }

                    if (y == first) {
                        return 1
                    }

                    if (x < y) //sort string ascending
                        return -1

                    if (x > y)
                        return 1

                    return 0
                })
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
                this.notification.type = 3
            break;
            case 1:
                this.notification.type = 2
            break; 
            case 2:
                this.notification.type = 1
            break; 
            case 3:
                this.notification.type = 2
            break; 
            case 4:
                this.notification.type = 4
            break; 
        }
        this.notification.createdAt = new Date()

        this.socketIOService.sendNotification(this.notification);
    }

}
