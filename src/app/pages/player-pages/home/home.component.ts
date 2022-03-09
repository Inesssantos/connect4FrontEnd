import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Chart } from 'chart.js';

import { AccountService } from 'app/_services/account.service';
import { SocketIOService } from 'app/_services/socket.io.services';


@Component({
  selector: 'home-cmp',
  moduleId: module.id,
  templateUrl: 'home.component.html',
})


export class HomeComponent implements OnInit {

  @ViewChild('pieCanvas') private pieCanvas: ElementRef;

  pieChart: any;

  id: string;
  wins: Number;
  losses: Number;
  xp: Number;
  level: Number;
  wallOfFame = [];

  constructor(private accountService: AccountService, private socketIOService: SocketIOService) { }

  ngOnInit() {
    this.id = this.accountService.userValue.id;

    this.accountService.getById(this.id).pipe(first()).subscribe(x => {
      this.wins = x.wins;
      this.losses = x.losses;
      this.xp = x.losses;
      this.level = x.level;
      if (this.wins != 0 || this.losses != 0) {
        this.pieChartBrowser();
      }

    });

    this.accountService.getWallOfFame().pipe(first()).subscribe(x =>{
      this.wallOfFame=x;
    })
    
    this.socketIOService.receiveNotification().subscribe(notification => {
      this.accountService.getWallOfFame().pipe(first()).subscribe(x => {
        this.wallOfFame = x;
      })
    });


  }


  pieChartBrowser(): void {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Wins', 'Losses'],
        datasets: [{
          backgroundColor: [
            '#6BD197',
            '#EE8256'
          ],
          data: [this.wins, this.losses]
        }]
      }
    });
  }


}
