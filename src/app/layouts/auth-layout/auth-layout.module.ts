import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from '../../pages/auth-pages/login/login.component';
import { RegisterPlayerComponent } from '../../pages/auth-pages/register-player/register-player.component';
import { TemporaryModeratorComponent } from '../../pages/auth-pages/temporary-moderator/temporary-moderator.component';
import { PasswordStrengthBarModule } from 'app/components/password-strength-bar/password-strength-bar.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    ReactiveFormsModule,//Add if needed 
    FormsModule,
    NgbModule,
    PasswordStrengthBarModule
  ],
  declarations: [
    LoginComponent,
    RegisterPlayerComponent,
    TemporaryModeratorComponent,
  ]
})
export class AuthLayoutModule { }
