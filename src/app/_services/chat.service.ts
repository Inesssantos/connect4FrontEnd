import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Conversation } from '../_models/conversation';
import { Message } from '../_models/message';

@Injectable({ providedIn: 'root' })
export class ChatService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  createConversation(userId: string, friendId: string) {
    return this.http.post(`${environment.apiUrl}/messenger/create-conversation`, { userId, friendId });
  }

  getAllConversation(userId: string, friendId: string) {
    return this.http.get<Conversation[]>(`${environment.apiUrl}/messenger/get-all-conversations/${userId}`);
  }

  getConversation(userId: string, friendId: string) {
    return this.http.get<Conversation>(`${environment.apiUrl}/messenger/get-conversation/${userId}/${friendId}`);
  }

  deleteConversation(id: string) {
    return this.http.delete(`${environment.apiUrl}/messenger/delete-conversation/${id}`)
      .pipe(map(x => {
        return x;
      }));
  }

  getMessages(id: string) {
    return this.http.get<Message[]>(`${environment.apiUrl}/messenger/get-messages/${id}`);
  }

  addMessage(message: Message) {
    return this.http.post(`${environment.apiUrl}/messenger/add-message`, message);
  }

  deleteMessage(id: string) {
    return this.http.delete(`${environment.apiUrl}/messenger/delete-messages/${id}`)
      .pipe(map(x => {
        return x;
      }));
  }

}