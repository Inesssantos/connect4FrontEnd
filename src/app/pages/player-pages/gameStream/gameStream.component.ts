import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import {Case} from './case';

import { environment } from '../../../../environments/environment'

import { SocketIOService } from 'app/_services/socket.io.services';


@Component({
    selector: 'gameStream-cmp',
    moduleId: module.id,
    templateUrl: 'gameStream.component.html',
    styleUrls: ['gameStream.component.css'],
})

export class GameStreamComponent implements OnInit,OnDestroy{
    public stringGame: string
    private game;
    private gameGrid= []
    private socket;
    private roomName;
    
    endStream: boolean = false;
    gameStream: boolean = false;

    constructor(private router: Router, private activeRoute: ActivatedRoute, private socketIOService: SocketIOService) { 
    }


    ngOnInit(){
        this.activeRoute.queryParams.subscribe(params => {
            if (params['data']) {
                this.stringGame = params['data'];

                this.router.navigate([], {
                    relativeTo: this.activeRoute,
                    queryParams: {},
                    replaceUrl: true,
                });
            }
            else{
                this.router.navigate(['/home']);
            }
        });

        this.roomName = JSON.parse(this.stringGame)
        console.log(this.roomName)
        this.socketIOService.getStreamGame(this.roomName)

        this.socketIOService.receiveGameUpdates().subscribe(game => {
            this.game=game
            console.log('game received',game)  
            this.clearGrid()
            this.updateGrid()   
        });

        this.socketIOService.receiveGameUpdates().subscribe(streamRoom => {
            const test=JSON.stringify(this.game.roomName)
            console.log('stream ended',streamRoom == test)
            if(streamRoom === test)
            {
                console.log('entrou')
                this.showEndStream()  
            }       
        });
    }

    ngOnDestroy(){
    }
    
    updateGrid(){
        this.clearGrid()
        this.pushRows(this.game.row1);
        this.pushRows(this.game.row2);
        this.pushRows(this.game.row3);
        this.pushRows(this.game.row4);
        this.pushRows(this.game.row5);
        this.pushRows(this.game.row6); 
    }

    clearGrid() {
        this.gameGrid=[]
        console.log('clear grid:',this.gameGrid)
    }

    pushRows(row){
        let columns = [];
        //row 1
        for (let i = 0; i < 7; i++) {
            columns.push(new Case(row[i]));
        }
        this.gameGrid.push(columns);
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

    showEndStream(){
        this.endStream = false;
        this.game = true;
    }
    
    goToGameTab(){
        this.router.navigate(['/game']);
    }
}

