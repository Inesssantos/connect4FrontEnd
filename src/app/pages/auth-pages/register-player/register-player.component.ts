import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../_services/account.service';
import { Roles } from 'app/_guards/roles';

@Component({
  selector: 'register-player-cmp',
  templateUrl: './register-player.component.html',
})
export class RegisterPlayerComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  strength = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {
    if (this.accountService.userValue) {
      if (this.accountService.userValue.role == Roles.Player) {
        this.router.navigate(['/home']);
      }
      if (this.accountService.userValue.role == Roles.Moderator) {
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
    body.classList.add("register-page");

    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: Roles.Player
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

    if (this.strength < 50) {
      this.error = "Your password is too weak -- Please enter a stronger password";
      this.loading = false;
      return
    }

    this.loading = true;
    this.accountService.register(this.registerForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
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

}
