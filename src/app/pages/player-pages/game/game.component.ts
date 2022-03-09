import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../_services/account.service';

import { first } from 'rxjs/operators';

import { FriendService } from '../../../_services/friend.service';
import { environment } from '../../../../environments/environment'

import { NotificationService } from 'app/_services/notification.service';
import { SocketIOService } from 'app/_services/socket.io.services';
import { GameService } from './brain/game.service';
import { MyNotification } from 'app/_models/notification';

import { io, Socket } from 'socket.io-client';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'game-cmp',
  moduleId: module.id,
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css']
})

export class GameComponent implements OnInit, OnDestroy {

  public pieces = [{ visible: false }, { visible: false }, { visible: false }, { visible: false }, { visible: false }, { visible: false }, { visible: false }];
  public winner: number = 0;
  public lost: number = 0
  private _game: GameService;
  private id: string;
  private socket;
  private socketGame;

  private friendsOnlineList = [];
  private gameRequestList = [];
  private gamePlayers = [];
  private liveGames = [];

  startMenu: boolean = true;
  waitingRoom: boolean = false;
  readyCard: boolean = false;
  boardGame: boolean = false;

  notification: MyNotification = new MyNotification;
  notificationMessages: string[] = ['sent a request to play with you', 'refused your request to play', 'accepted your request to play'];

  constructor(
    private router: Router,
    private accountService: AccountService,
    private notifyService: NotificationService,
    private friendService: FriendService,
    private socketIOService: SocketIOService,
    game: GameService,) {
    this._game = game;
    this.id = this.accountService.userValue.id;
    
  }

  /* FUNCTIONS RESPONSIBLE FOR CHANGING THE GAME BOARD - BEGIN */
  add(column: number) {
    console.log('socket game in add', this.socketGame)
    if (this.socketGame.turn === this.id) { //checks if in the game data given by the socket the id of the turn is the same as the id of the player
      const winner = this._game.addPiece(column, true); //adds a piece to the board in the column clicked and informs the function that it is the current client placing the piece

      if (winner === 0) { //if winner ===0 then in the previus placement there was no winner found 
        this.socketGame = this._game.nextPlayer(this.socketGame);//changes player in the client and in the socket game so that that game can be sent in the next emit
        this.socketGame = this._game.getsocketGame();
        this.socketGame.lastPlay = column //adds the column played to the last column so that the other client can place this clients piece in the right spot
         //emits an "end turn" so the the server can inform the other client that this player has played 
        this.socketIOService.sendEndTurn(this.socketGame);
      } else if (winner !== -1) { //if winner ===1 then the winner was fount in line 46
        console.log("winner", winner)
        this.winner = winner;
        //console.log( this._game.getsocketGame())
        this.socketGame = this._game.getsocketGame();//get updated socket game saved in game.service that has all the recorded plays
        this.socketIOService.sendWinner(this.socketGame, this.id)
        //informs the server that the winner was found sending an emit winner this client id  and the game with all the plays recorded
        this.winner = 0
        this.restart()
        this.gameHome()
        this.notifyService.showSuccess("Win!!", "Congrats you WON!!", 4)
      }
    }
    else {
      this.notifyService.showWarning("Wait your turn", "Is not your turn player 2 is playing", 2) //if its not this clients turn shows a toaster warning notification
    }
  }

  //add pieces from player 2
  addFromPlayer2(column: number) {
    const winner = this._game.addPiece(column, false); //puts the piece that the other client placed and informs the function that is not the current client's play so that the record of plays is accurate
    if (winner === 0) {
      this._game.nextPlayer2(); //changes player in game service(1 or 2) so that the colors are accurate, this does not change player in the socket game
    }
  }

  show(i: number) {
    this.pieces.map((piece, index) => piece.visible = i === index);
  }

  get game(): GameService {
    return this._game;
  }

  restart() {
    this._game.clear();
  }
  /* FUNCTIONS RESPONSIBLE FOR CHANGING THE GAME BOARD - END */


  ngOnInit() {
    this.id = this.accountService.userValue.id;

    this.readData()

    this.socketIOService.receiveNotification().subscribe(notification => {
      this.readData()
    });

    this.socketListeners()
  }

  ngOnDestroy() {
    if (this.socketGame)
    this.socketIOService.leftGame(this.socketGame)
      
  }

  readData() {
    this.friendService.getFriendsOnline(this.id)
      .pipe(first())
      .subscribe(x => { this.friendsOnlineList = x; });
    this.friendService.getGameRequests(this.id)
      .pipe(first())
      .subscribe(x => { this.gameRequestList = x; });
    this.friendService.getLiveGames()
      .pipe(first())
      .subscribe(x => {
        this.liveGames = x;
        console.log(x)
      });
  }

  socketListeners() {//contains all the listeners for the server emits
    this.socket = io(environment.apiUrl);

    this.socketIOService.receiveWaitingList().subscribe(() => {//when the server informs the player that he was placed in waiting it sends a 'socket game' with all the information of the game if said game has the param 'full' false then the server has not found the second player
      this.goToWaitingList()
    });

    this.socketIOService.receiveNewTurn().subscribe((game) => {//the other player just played and its this player turn to play
      console.log("new turn in room:", this.socketGame.id);
      this.socketGame = game;//saves the game so that the turns are updated
      this.addFromPlayer2(this.socketGame.lastPlay)//places the 'other players' play in the board
    });

    this.socketIOService.receiveLoser().subscribe(() => {
      //server informs you that you lost the game
      console.log("lost!")
      //this.lost=1//put var lost at 1 so that the screen can change
      this.restart()
      this.gameHome()
      this.reloadComponent();
      this.notifyService.showError("Lost", "Unfortunately you lost", 4)
      //                   
    });

    this.socketIOService.receiveWinner().subscribe(() => {//server informs you to you have won because the other player quit 
      console.log("winner!")
      this.winner = 1//put var winner at 1 so that the screen can change
      this.restart()
      this.gameHome()
      this.reloadComponent();
      this.notifyService.showSuccess("Win!!", "Congrats you WON!!", 4)
    });

    this.socketIOService.receivePlayerOccupied().subscribe((game) => {
      console.log('error in costum game', game)
      this.notifyService.showError("Error in custom game", "unfortunately the your friend is not available for a game", 2)
    });

    this.socketIOService.receiveReadyQuestion().subscribe((data:any) => {
      console.log('ready question', data)

      if (this.checkIfMyGame(data.game, this.id)) {
        this.socketGame = data.game
        this.gamePlayers = data.playersInfo;
        console.log(data);
        this.startMenu = false;
        this.waitingRoom = false;
        this.readyCard = true;
        this.boardGame = false;
        console.log("startMenu:"+this.startMenu+"waitingRoom:"+this.waitingRoom+"readyCard:"+this.readyCard+"boardGame:"+this.boardGame)

      }
    });

  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  goToWaitingRoom() {
    this.socketIOService.goToWaitingRoom(this.id)
  }

  quit() {
    console.log("quit!")
    this.restart()
    this.socketIOService.sendQuit(this.socketGame, this.id)

    
    this.socket.disconnect()
    this.router.navigate(['/home']);
  }



  readyCheck() {
    this.socketIOService.sendReady(this.socketGame)
    if (this.socketGame.turn == this.id)
      this._game.setPlayerNum(1, this.socketGame)//sends the player number and saves the socket game in the to the game.service
    else { this._game.setPlayerNum(2, this.socketGame) }//sends the player number and saves the socket game in the to the game.service

    this.startGame();
  }

  gameRequest(friendId) {
    this.sendNotification(0,friendId)

    this.notifyService.showSuccess("Game request", "This game request is valid while your friend is online or until you start a game", 4)
    this.friendService.sendRequestGame(this.id, friendId).pipe(first())
      .subscribe({
        next: () => {
          this.reloadComponent();
        }
      });
  }

  refuseGameRequest(friendId: string) {
    this.sendNotification(1,friendId)
    this.friendService.refuseGameRequest(this.id, friendId).pipe(first())
    .subscribe({
      next: () => {
        this.reloadComponent();
      }
    });
  }

  acceptGameRequest(friendId: string) {
    this.sendNotification(2,friendId)
    const data = {
      player1: this.id,
      player2: friendId
    }
    this.socketIOService.sendCustomGame(data)
  }

  /* Go to Stream Game */
  watchStream(room: string){
    console.log('go watch stream in room:',room);
    this.socketIOService.sendStream(room)

    this.socketIOService.receiveStreamSuccess().subscribe(() => {
      console.log('stream success')
      this.router.navigate(['/gameStream/' + JSON.stringify(room)]);
    });

    this.socketIOService.receiveStreamError().subscribe(() => {//server informs you to you have won because the other player quit 
      this.notifyService.showError("Stream not available", "The stream you have selected is no longer available", 4)
    });

  }

  sendNotification(type: number, friendId: string) {
    this.notification.from = this.id;
    this.notification.to = friendId;
    this.notification.title = "Game Requests";
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
    }
    this.notification.createdAt = new Date()

    this.socketIOService.sendNotification(this.notification);
  }

  startGame() {
    this.startMenu = false;
    this.waitingRoom = false;
    this.readyCard = false;
    this.boardGame = true;
    console.log("startMenu:"+this.startMenu+"waitingRoom:"+this.waitingRoom+"readyCard:"+this.readyCard+"boardGame:"+this.boardGame)
  }
  
  checkIfMyGame(game: any, id) {
    if (game.Player1 === id || game.Player2 === id)
      return true;
    return false;
  
  }
  
  goToWaitingList() {
    this.startMenu = false;
    this.waitingRoom = true;
    this.readyCard = false;
    this.boardGame = false;
    console.log("startMenu:"+this.startMenu+"waitingRoom:"+this.waitingRoom+"readyCard:"+this.readyCard+"boardGame:"+this.boardGame)
  
  }
  
  gameHome() {
    this.startMenu = true;
    this.waitingRoom = false;
    this.readyCard = false;
    this.boardGame = false;
    console.log("startMenu:"+this.startMenu+"waitingRoom:"+this.waitingRoom+"readyCard:"+this.readyCard+"boardGame:"+this.boardGame)
  
  }

}





