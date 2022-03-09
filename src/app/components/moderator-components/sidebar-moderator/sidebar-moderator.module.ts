import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarModeratorComponent } from './sidebar-moderator.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ SidebarModeratorComponent ],
    exports: [ SidebarModeratorComponent ]
})

export class SidebarModeratorModule {}
