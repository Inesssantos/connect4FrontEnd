import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarPlayerComponent } from './sidebar-player.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ SidebarPlayerComponent ],
    exports: [ SidebarPlayerComponent ]
})

export class SidebarPlayerModule {}
