import { Routes } from '@angular/router';

import { AuthGuard } from '../../_guards/moderator-auth.guard';

import { DashboardComponent } from '../../pages/moderator-pages/dashboard/dashboard.component';
import { ListUsersComponent } from '../../pages/moderator-pages/list-users/list-users.component';
import { RegiserModeratorComponent } from '../../pages/moderator-pages/register-moderator/register-moderator.component';
import { ProfileComponent } from '../../pages/moderator-pages/profile/profile.component';

import { LogoutComponent } from '../../pages/auth-pages/logout/logout.component';

export const ModeratorLayoutRoutes: Routes = [
    { path: '',                 component: DashboardComponent,              canActivate: [AuthGuard] },
    { path: 'dashboard',        component: DashboardComponent,              canActivate: [AuthGuard] },
    { path: 'users',            component: ListUsersComponent,              canActivate: [AuthGuard]},
    { path: 'moderator',        component: RegiserModeratorComponent,       canActivate: [AuthGuard] },
    { path: 'profile',          component: ProfileComponent,                canActivate: [AuthGuard] },
    { path: 'logout',           component: LogoutComponent }
];