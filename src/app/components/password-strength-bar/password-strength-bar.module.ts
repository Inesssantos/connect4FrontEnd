import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PasswordStrengthBarComponent } from './password-strength-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [ RouterModule, CommonModule, NgbModule ],
    declarations: [ PasswordStrengthBarComponent ],
    exports: [ PasswordStrengthBarComponent ]
})

export class PasswordStrengthBarModule {}
