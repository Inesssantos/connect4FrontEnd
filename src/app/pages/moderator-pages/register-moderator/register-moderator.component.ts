import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../_services/account.service';
import { Roles } from 'app/_guards/roles';
import { NotificationService } from '../../../_services/notification.service';

@Component({
  selector: 'register-moderator-cmp',
  templateUrl: 'register-moderator.component.html'
})

export class RegiserModeratorComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  strength = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private notifyService: NotificationService
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstname: "temporary",
      lastname: "temporary",
      email: "temporary",
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: Roles.Moderator,
      temporary: true
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }


  onSubmit() {
    this.submitted = true;

    alert()

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    if (this.strength < 50) {
      this.error = "Your password is too weak -- Please enter a stronger password";
      this.loading = false;
      return
    }

    this.loading = true;
    console.log(this.registerForm.value)
    this.accountService.register(this.registerForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.notifyService.showSuccess("REGISTER", "Moderator successfully registered", 2)
          this.reloadComponent();
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  onStrengthChange(value: number) {
    this.strength = value;
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}