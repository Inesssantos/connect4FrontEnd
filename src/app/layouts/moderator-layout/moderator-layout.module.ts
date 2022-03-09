import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModeratorLayoutRoutes } from './moderator-layout.routing';

import { DashboardComponent }       from '../../pages/moderator-pages/dashboard/dashboard.component';
import { ProfileComponent } from '../../pages/moderator-pages/profile/profile.component';
import { ListUsersComponent } from '../../pages/moderator-pages/list-users/list-users.component';
import { RegiserModeratorComponent} from '../../pages/moderator-pages/register-moderator/register-moderator.component';
import { PasswordStrengthBarModule } from 'app/components/password-strength-bar/password-strength-bar.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ModeratorLayoutRoutes),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    PasswordStrengthBarModule
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    ListUsersComponent,
    RegiserModeratorComponent,
  ],
})

export class ModeratorLayoutModule {}
