import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/auth-pages/login/login.component';
import { RegisterPlayerComponent } from '../../pages/auth-pages/register-player/register-player.component';
import { TemporaryModeratorComponent } from '../../pages/auth-pages/temporary-moderator/temporary-moderator.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',                component: LoginComponent },
    { path: 'register',             component: RegisterPlayerComponent },
    { path: 'temporary-moderator',   component: TemporaryModeratorComponent }
];
