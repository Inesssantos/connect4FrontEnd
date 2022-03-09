import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ModeratorLayoutComponent } from './layouts/moderator-layout/moderator-layout.component';
import { PlayerLayoutComponent } from './layouts/player-layout/player-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }, {
    path: '',
    component: ModeratorLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/moderator-layout/moderator-layout.module').then(m => m.ModeratorLayoutModule)
      }
    ]
  }, {
    path: '',
    component: PlayerLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/player-layout/player-layout.module').then(m => m.PlayerLayoutModule)
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  }, {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
