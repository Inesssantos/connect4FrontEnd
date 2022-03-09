import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarPlayerComponent } from './navbar-player.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [ RouterModule, CommonModule, NgbModule ],
    declarations: [ NavbarPlayerComponent ],
    exports: [ NavbarPlayerComponent ]
})

export class NavbarPlayerModule {}
