import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModeratorComponent } from './moderator-components/sidebar-moderator/sidebar-moderator.component';
import { SidebarPlayerComponent } from './player-components/sidebar-player/sidebar-player.component';
import { NavbarModeratorComponent } from './moderator-components/navbar-moderator/navbar-moderator.component';
import { NavbarPlayerComponent } from './player-components/navbar-player/navbar-player.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  declarations: [
    NavbarModeratorComponent,
    NavbarPlayerComponent,
    SidebarModeratorComponent,
    SidebarPlayerComponent,
  ],
  exports: [
    NavbarModeratorComponent,
    NavbarPlayerComponent,
    SidebarModeratorComponent,
    SidebarPlayerComponent,
  ]
})
export class ComponentsModule { }
