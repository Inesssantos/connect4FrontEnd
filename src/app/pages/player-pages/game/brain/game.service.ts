import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import {Case} from './case';
import {GridManagerService} from "./grid-manager.service";

@Injectable()
export class GameService {

  private _grid: Case[][] = [];
  private _currentPlayer: number = 1;
  private _gridManager: GridManagerService = new GridManagerService;

  private PlayerNum: number;
  private socketGame;
  
  constructor(gridManager: GridManagerService, ) {
    for (let i = 0; i < 6; i++) {
      let columns = [];
      for (let i = 0; i < 7; i++) {
        columns.push(new Case(0));
      }
      this._grid.push(columns);
      this._gridManager = gridManager;
    }
  }

  get currentPlayer(): number {
    return this._currentPlayer;
  }

  set currentPlayer(player: number) {
    this._currentPlayer = player;
  }

  setPlayerNum(player: number,socketGame) {
    this.PlayerNum = player;
    this.socketGame = socketGame;
  }

  getsocketGame() {
    return this.socketGame;
  }

  isPlayerOne(): boolean {
    return this._currentPlayer === 1;
  }

  isPlayerTwo(): boolean {
    return this._currentPlayer === 2;
  }

  isMyTurn():boolean{
    return this._currentPlayer === this.PlayerNum;
  }



  addPiece(column: number, currentClient:boolean): number {
    if (column >= 0 && column < this._grid[0].length && this._grid[0][column].isEmpty()) {
      let i = 5;
      while (!this._grid[i][column].isEmpty()) {
        i--;
      }
      this._grid[i][column].state = this._currentPlayer;
      this.savePlay(i,column,this.socketGame, currentClient);
      return this._gridManager.hasFour(this._currentPlayer, this._grid) ? this._currentPlayer : 0;
    } else {
      return -1;
    }
  }

  savePlay(row,column,socketGame, currentClient){
    let player
    if (currentClient)
      player = this.PlayerNum
    else if (this.PlayerNum === 1)
      player = 2
    else player = 1

    switch (row) {
      case 0:
        socketGame.row1[column]=player
        break;
      case 1:
        socketGame.row2[column]=player
        break;
      case 2:
        socketGame.row3[column]=player
        break;
      case 3:
        socketGame.row4[column]=player
        break;
      case 4:
        socketGame.row5[column]=player
        break;
      case 5:
        socketGame.row6[column]=player
        break;
    }
  }

  nextPlayer(game) {
    this._currentPlayer = (this._currentPlayer === 1) ? 2 : 1;
    if(game.turn === game.Player2){
      game.turn = game.Player1
    }
    else {
      game.turn = game.Player2
    }

    return game;
  }
  nextPlayer2() {
    this._currentPlayer = (this._currentPlayer === 1) ? 2 : 1;
  }

  get grid(): Case[][] {
    return this._grid;
  }

  clear() {
    this._grid = [];
    for (let i = 0; i < 6; i++) {
      let columns = [];
      for (let i = 0; i < 7; i++) {
        columns.push(new Case(0));
      }
      this._grid.push(columns);
    }
    this._currentPlayer = 1;
  }

}
