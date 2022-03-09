import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { first, filter } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ModeratorService } from '../../../_services/moderator.service';
import { AccountService } from '../../../_services/account.service';

@Component({
  selector: 'listusers-cmp',
  moduleId: module.id,
  templateUrl: 'list-users.component.html'
})

export class ListUsersComponent implements OnInit {
  users = [];

  id: string;
  searchValue: string;
  @ViewChild('search') search: ElementRef

  filters =
    [
      { id: 1, type: "Name" },
      { id: 2, type: "Username" },
      { id: 3, type: "Wins" },
      { id: 4, type: "Losses" },
    ];
  filterDirection: boolean = true;
  lastFilter: number = -1;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private accountService: AccountService, private moderatorService: ModeratorService) {
    console.log(this.filterDirection)
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
        this.moderatorService.getAll().pipe(first())
          .subscribe(x => { this.users = x; });
      }
    });

  }

  onSubmit(value: string) {

    if (value) {
      this.searchValue = value;
      this.moderatorService.searchUser(this.id, this.searchValue)
        .pipe(first())
        .subscribe(x => { this.users = x; });
    }
    else {
      this.searchValue = "";
      this.search.nativeElement.value = this.searchValue
      this.moderatorService.getAll().pipe(first())
        .subscribe(x => { this.users = x; });
    }
    this.search.nativeElement.value = this.searchValue
  }

  filterResults(type: number) {
    if (type <= this.filters.length && type >= 0) {
      this.lastFilter = type;
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
          if (this.filterDirection) {
            this.users.sort(function (a, b) {
              var x = a.wins, y = b.wins
              if (x < y) //sort string ascending
                return -1
              if (x > y)
                return 1
              return 0
            })
          }
          else {
            this.users.sort(function (a, b) {
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
            this.users.sort(function (a, b) {
              var x = a.losses, y = b.losses
              if (x < y) //sort string ascending
                return -1
              if (x > y)
                return 1
              return 0
            })
          }
          else {
            this.users.sort(function (a, b) {
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

  removeUser(userId: string) {
    this.moderatorService.delete(userId).pipe(first())
      .subscribe({
        next: () => {
          this.reloadComponent();
        }
      });
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
