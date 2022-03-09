import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PlayerLayoutRoutes } from './player-layout.routing';

import { HomeComponent } from 'app/pages/player-pages/home/home.component';
import { ProfileComponent } from 'app/pages/player-pages/profile/profile.component';
import { ChatComponent } from 'app/pages/player-pages/chat/chat.component';
import { GameComponent } from 'app/pages/player-pages/game/game.component';
import { GameStreamComponent } from 'app/pages/player-pages/gameStream/gameStream.component';
import { FriendsComponent } from 'app/pages/player-pages/friends/friends.component';
import { PasswordStrengthBarModule } from 'app/components/password-strength-bar/password-strength-bar.module';
import { SearchComponent } from 'app/pages/player-pages/search/search.component';

import { GameService } from 'app/pages/player-pages/game/brain/game.service';
import { GridManagerService } from 'app/pages/player-pages/game/brain/grid-manager.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PlayerLayoutRoutes),
    ReactiveFormsModule,//Add if needed 
    FormsModule,
    NgbModule,
    PasswordStrengthBarModule,
  ],
  declarations: [
    HomeComponent,
    ProfileComponent,
    ChatComponent,
    GameComponent,
    GameStreamComponent,
    FriendsComponent,
    SearchComponent,
  ],
  providers: [
    GameService,
    GridManagerService,
  ]

})

export class PlayerLayoutModule {}
