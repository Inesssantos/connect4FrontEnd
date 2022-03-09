import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    public token_exist: boolean = false;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(null);
        this.user = this.userSubject.asObservable();
    }

    public get token(): boolean {
        return this.token_exist;
    }

    public get userValue(): User {
        return this.userSubject.value;
    }


    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(data => {
                this.token_exist = true;
                sessionStorage.setItem('refreshToken', data.refreshToken);
                this.userSubject.next(data.user);
                this.startRefreshTokenTimer();
                return data.user;
            }));
    }

    logout() {
        this.http.post<any>(`${environment.apiUrl}/users/revoke-token`, {}).subscribe();
        sessionStorage.removeItem('refreshToken');
        this.stopRefreshTokenTimer();
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    refreshToken() {
        var refreshToken: string = sessionStorage.getItem('refreshToken');
        return this.http.post<any>(`${environment.apiUrl}/users/refresh-token`, { refreshToken })
            .pipe(map((data) => {
                this.token_exist = true;
                sessionStorage.setItem('refreshToken' , data.refreshToken);
                this.userSubject.next(data.user);
                this.startRefreshTokenTimer();
                return data.user;
            }));

    }

    getToken(id: string) {
        this.http.get<any>(`${environment.apiUrl}/users/${id}/get-token`).subscribe(responseData => {
            if (responseData.length > 0) {
                this.token_exist = true;
            }
            else {
                this.token_exist = false
            }
        });
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    getWallOfFame() {
        return this.http.get<User[]>(`${environment.apiUrl}/users/wall-of-fame`);
    }

    update(id: string, params: object) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    update_avatar(id: string, image: File) {
        const avatarData = new FormData();
        const imageName = id + Date.now() + "." + image.name.split('.').pop();
        avatarData.append("image", image, imageName);

        return this.http.post(`${environment.apiUrl}/users/${id}/update-avatar`, avatarData)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    var newImage = { avatar: environment.apiUrl + '/uploads/' + imageName }

                    const user = { ...this.userValue, ...newImage };

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    updateTemporary(id: string, params: object) {
        return this.http.put(`${environment.apiUrl}/moderator/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }

    // helper methods

    private refreshTokenTimeout;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.userValue.jwtToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}