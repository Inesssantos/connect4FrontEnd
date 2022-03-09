import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from 'app/_services/account.service';
import { ModeratorService } from 'app/_services/moderator.service';
import { Roles } from 'app/_guards/roles';
import { NotificationService } from 'app/_services/notification.service';

@Component({
  selector: 'app-temporary-moderator',
  templateUrl: './temporary-moderator.component.html',
})

export class TemporaryModeratorComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private notifyService: NotificationService
  ) {
    if (this.accountService.userValue) {
      if (this.accountService.userValue.role == Roles.Player) {
        this.router.navigate(['/home']);
      }
      if (this.accountService.userValue.role == Roles.Moderator) {
        if (this.accountService.userValue.temporary) {
          this.router.navigate(['/temporary-moderator']);
        }
        else {
          this.router.navigate(['/dashboard']);
        }
      }
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");

    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      temporary: false
    });
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;


    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.updateTemporary(this.accountService.userValue.id, this.registerForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.notifyService.showSuccess("UPDATE", "Your personal information has been successfully updated.", 2)
          this.router.navigate(['/login']);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }

}
