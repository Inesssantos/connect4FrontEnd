import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarModeratorComponent } from './navbar-moderator.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [ RouterModule, CommonModule, NgbModule ],
    declarations: [ NavbarModeratorComponent ],
    exports: [ NavbarModeratorComponent ]
})

export class NavbarModeratorModule {}
