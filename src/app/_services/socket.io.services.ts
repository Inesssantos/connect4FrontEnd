import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../environments/environment';

import { Message } from 'app/_models/message';
import { MyNotification } from 'app/_models/notification';


@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
 
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl);
    console.log("SOCKET ID: "+ this.socket)
  }

  joinToRoom(userId: string, room: string){
    this.socket.emit('joinToRoom', { userId, room });
  }

  leaveRoom(room: string){
    this.socket.emit('leaveRoom', room)
  }

  sendNotification(notification: MyNotification) {
    this.socket.emit('sendNotification', notification);
  }

  receiveNotification() {
    return new Observable(observer => {
      this.socket.on('receiveNotification', (notification) => {
        observer.next(notification);
      });
    });
  }

  sendMessage(message: Message) {
    this.socket.emit('sendMessage', message);
  }

  receiveMessage() {
    return new Observable(observer => {
      this.socket.on('receiveMessage', (message) => {
        observer.next(message);
      });
    });
  }

  /* Game */
  sendEndTurn(socketGame: any) {
    this.socket.emit("end turn", socketGame);
  }
  sendWinner(socketGame: any, id: string) {
    this.socket.emit("winner", socketGame, id);
  }
  sendStream(room: string) {
    this.socket.emit("stream", room);
  }
  sendCustomGame(data: { player1: string; player2: string; }) {
    this.socket.emit("customGame", data);
  }
  sendReady(socketGame: any) {
    this.socket.emit("ready", socketGame);
  }

  sendQuit(socketGame: any, id: string) {
    this.socket.emit("quit", socketGame, id)
  }

  goToWaitingRoom(id: string) {
    this.socket.emit("waiting", id);
  }

  leftGame(socketGame: any) {
    this.socket.emit("leftGame", socketGame);
  }

  receiveWaitingList() {
    return new Observable(observer => {
      this.socket.on('waiting list', (answer: number) => {
        observer.next(answer);
      });
    });
  }

  receiveNewTurn() {
    return new Observable(observer => {
      this.socket.on('new turn', (game) => {
        observer.next(game);
      });
    });
  }

  receiveLoser() {
    return new Observable(observer => {
      this.socket.on('loser', () => {
        observer.next();
      });
    });
  }

  receiveWinner() {
    return new Observable(observer => {
      this.socket.on('winner', () => {
        observer.next();
      });
    });
  }

  receivePlayerOccupied() {
    return new Observable(observer => {
      this.socket.on('playerOccupied', (game) => {
        observer.next(game);
      });
    });
  }

  receiveReadyQuestion() {
    return new Observable(observer => {
      this.socket.on('readyQuestion', (data) => {
        observer.next(data);
      });
    });
  }

  receiveStreamError() {
    return new Observable(observer => {
      this.socket.on('streamError', () => {
        observer.next();
      });
    });
  }

  receiveStreamSuccess() {
    return new Observable(observer => {
      this.socket.on('streamSuccess', (data) => {
        observer.next(data);
      });
    });
  }
  /* Game Stream */
  sendRequestToWatchStream(room: string){
    this.socket.emit("requestToWatchStream", room);
  }
 
  receiveAnswerToWatchStream() {
    return new Observable(observer => {
      this.socket.on('answerToWatchStream', (answer: number) => {
        observer.next(answer);
      });
    });
  }

  getStreamGame(room: string){
    this.socket.emit('getStreamGame',room);
  }

  receiveGameUpdates() {
    return new Observable(observer => {
      this.socket.on('update', (game) => {
        observer.next(game);
      });
    });
  }

  receiveGameStreamEnd(){
    return new Observable(observer => {
      this.socket.on('endStream', (streamRoom) => {
        observer.next(streamRoom);
      });
    });
  }

}
