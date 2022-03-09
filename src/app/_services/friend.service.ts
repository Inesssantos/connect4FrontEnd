import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Friend } from '../_models/friend';

@Injectable({ providedIn: 'root' })
export class FriendService {

    constructor(
        private http: HttpClient
    ) {
    }

    getListUsers(id: string) {
        return this.http.get<Friend[]>(`${environment.apiUrl}/friends/${id}/get-list-users`);
    }

    searchUser(id: string, username: string) {
        return this.http.get<Friend[]>(`${environment.apiUrl}/friends/${id}/search-user/${username}`);
    }

    sendRequestFriend(userId: string, friendId: string) {
        return this.http.post(`${environment.apiUrl}/friends/send-request-friend`, { userId, friendId });
    }

    cancelRequestFriend(userId: string, friendId: string) {
        return this.http.post(`${environment.apiUrl}/friends/cancel-request-friend`, { userId, friendId });
    }

    getRequestsFriendsSend(userId: string,) {
        return this.http.post<Friend[]>(`${environment.apiUrl}/friends/get-request-friend-send`, {userId});
    }

    getRequestsFriendsReceived(userId: string,) {
        return this.http.post<Friend[]>(`${environment.apiUrl}/friends/get-request-friend-received`, {userId});
    }

    acceptFriend(userId: string, friendId: string) {
        return this.http.post<any>(`${environment.apiUrl}/friends/accept-friend`, { userId, friendId });
    }

    denyFriend(userId: string, friendId: string) {
        return this.http.post<any>(`${environment.apiUrl}/friends/deny-friend`, { userId, friendId });
    }

    removeFriend(userId: string, friendId: string) {
        return this.http.post<any>(`${environment.apiUrl}/friends/remove-friend`, { userId, friendId });
    }

    getFriends(id: string) {
        return this.http.get<Friend[]>(`${environment.apiUrl}/friends/${id}/get-friends`);
    }

    getFriendsOnline(id: string) {
        return this.http.get<Friend[]>(`${environment.apiUrl}/friends/${id}/get-friends-online`);
    }

    //game things
    getGameRequests(id: string) {
        return this.http.get<Friend[]>(`${environment.apiUrl}/friends/${id}/get-game-requests`);
    }
    sendRequestGame(userId: string, friendId: string) {
        return this.http.post(`${environment.apiUrl}/friends/send-request-game`, { userId, friendId });
    }
    acceptGameRequest(userId: string, friendId: string) {
        return this.http.post<any>(`${environment.apiUrl}/friends/accept-game-request`, { userId, friendId });
    }
    refuseGameRequest(userId: string, friendId: string) {
        return this.http.post<any>(`${environment.apiUrl}/friends/deny-game-request`, { userId, friendId });
    }
    getInfoForGame(player1: string, player2: string) {
        return this.http.post<Friend[]>(`${environment.apiUrl}/friends/get-info-game`, { player1, player2 });
    }
    getLiveGames() {
        return this.http.get<any>(`${environment.apiUrl}/game/get-live-games`);
    }
}