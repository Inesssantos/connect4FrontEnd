import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { Friend } from '../_models/friend';

@Injectable({ providedIn: 'root' })
export class ModeratorService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
    }

    searchUser(id: string, username: string) {
        return this.http.get<Friend[]>(`${environment.apiUrl}/moderator/${id}/search-user/${username}`);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/moderator/`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/moderator/${id}`);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/moderator/${id}`)
            .pipe(map(x => {
                return x;
            }));
    }
}