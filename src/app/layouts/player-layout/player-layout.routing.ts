import { Routes } from '@angular/router';

import { AuthGuard } from '../../_guards/player-auth.guard';

import { HomeComponent } from '../../pages/player-pages/home/home.component';
import { ProfileComponent } from '../../pages/player-pages/profile/profile.component';
import { ChatComponent } from '../../pages/player-pages/chat/chat.component';
import { GameComponent } from '../../pages/player-pages/game/game.component';
import { GameStreamComponent } from '../../pages/player-pages/gameStream/gameStream.component';
import { FriendsComponent } from '../../pages/player-pages/friends/friends.component';
import { SearchComponent } from 'app/pages/player-pages/search/search.component';
import { LogoutComponent } from '../../pages/auth-pages/logout/logout.component';


export const PlayerLayoutRoutes: Routes = [
    { path: '',                 component: HomeComponent,       canActivate: [AuthGuard] },
    { path: 'home',             component: HomeComponent,       canActivate: [AuthGuard] },
    { path: 'profile-player',   component: ProfileComponent,    canActivate: [AuthGuard] },
    { path: 'chat',             component: ChatComponent,       canActivate: [AuthGuard] },
    { path: 'friends',          component: FriendsComponent,    canActivate: [AuthGuard] },
    { path: 'game',             component: GameComponent,       canActivate: [AuthGuard] },
    { path: 'game-stream',      component: GameStreamComponent,          canActivate: [AuthGuard] },
    { path: 'search',           component: SearchComponent,     canActivate: [AuthGuard] },
    { path: 'logout',           component: LogoutComponent,     canActivate: [AuthGuard] }
];
