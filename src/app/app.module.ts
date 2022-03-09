import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";

import { AppComponent } from './app.component';
import { ModeratorLayoutComponent } from './layouts/moderator-layout/moderator-layout.component';
import { PlayerLayoutComponent } from './layouts/player-layout/player-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LogoutComponent } from './pages/auth-pages/logout/logout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { appInitializer } from './_helpers/app.initializer';
import { AccountService } from './_services/account.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    ModeratorLayoutComponent,
    PlayerLayoutComponent,
    AuthLayoutComponent,
    LogoutComponent,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
