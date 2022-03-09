import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../_services/account.service';
import { Roles } from 'app/_guards/roles';

@Component({
  selector: 'login-cmp',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {
    // redirect to home if already logged in
    if (this.accountService.userValue) {
      if(this.accountService.userValue.role == Roles.Player){
        this.router.navigate(['/home']);
      }
      if(this.accountService.userValue.role == Roles.Moderator){
        if(this.accountService.userValue.temporary){
          this.router.navigate(['/temporary-moderator']);
        }
        else{
          this.router.navigate(['/dashboard']);
        }
      }
    }
  }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {         
          if(this.accountService.userValue.role == Roles.Player){
            this.router.navigate(['/home']);
          }Roles.Player
          if(this.accountService.userValue.role == Roles.Moderator){
            this.router.navigate(['/dashboard']);
          }
          if(this.accountService.userValue.role == Roles.Moderator && this.accountService.userValue.temporary){
            this.router.navigate(['/temporary-moderator']);
          }
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }
}