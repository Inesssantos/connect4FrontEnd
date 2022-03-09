import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../_services/account.service';
import { NotificationService } from '../../../_services/notification.service';

@Component({
    selector: 'profile-cmp',
    moduleId: module.id,
    templateUrl: 'profile.component.html'
})

export class ProfileComponent implements OnInit {

    personalForm: FormGroup;
    loading_personal = false;
    submitted_personal = false;
    error_personal = '';

    securityForm: FormGroup;
    loading_security = false;
    submitted_security = false;
    error_security = '';
    strength = 0;

    avatarForm: FormGroup;
    loading_avatar = false;
    submitted_avatar = false;
    error_avatar = '';

    @ViewChild('remove') remove: ElementRef;

    // Personal Data
    id: string;
    imageData: string;
    temporaryImageData: string;
    
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private accountService: AccountService,
        private notifyService: NotificationService
    ) { }

    ngOnInit() {
        this.id = this.accountService.userValue.id;

        this.personalForm = this.formBuilder.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            username: ['', Validators.required],
        });

        this.securityForm = this.formBuilder.group({
            oldpassword: ['', [Validators.required, Validators.minLength(6)]],
            newpassword: ['', [Validators.required, Validators.minLength(6)]],
        });

        this.avatarForm = this.formBuilder.group({
            image: [null],
        });

        this.accountService.getById(this.id).pipe(first()).subscribe(x => { 
            this.imageData = x.avatar; 
            this.temporaryImageData = x.avatar; 
            this.personalForm.patchValue(x)
        });
    }

    // convenience getter for easy access to form fields
    get access_personalForm() { return this.personalForm.controls; }

    get access_securityForm() { return this.securityForm.controls; }


    onSubmitPersonal() {
        //this.submitted_personal = true;

        // stop here if form is invalid
        if (this.personalForm.invalid) {
            return;
        }

        this.loading_personal = true;
        this.accountService.update(this.id, this.personalForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifyService.showSuccess("UPDATE", "Your personal information has been successfully updated.", 2)
                    this.reloadComponent();
                },
                error: error => {
                    this.error_personal = error;
                    this.loading_personal = false;
                }
            });
    }

    onSubmitSecurity() {
        this.submitted_security = true;

        // stop here if form is invalid
        if (this.securityForm.invalid) {
            return;
        }

        if (this.strength < 50) {
            this.error_security = "Your password is too weak -- Please enter a stronger password";
            this.loading_security = false;
            return
        }
        
        this.loading_security = true;
        this.accountService.update(this.id, this.securityForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifyService.showSuccess("UPDATE", "Your security information has been successfully updated.", 2)
                    this.reloadComponent();
                },
                error: error => {
                    this.error_security = error;
                    this.loading_security = false;
                }
            });

    }

    onStrengthChange(value: number) {
        this.strength = value;
    }

    onSubmitAvatar() {
        this.submitted_avatar = true;

        this.accountService.update_avatar(this.id, this.avatarForm.value.image)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.notifyService.showSuccess("UPDATE", "Your avatar has been successfully updated.", 2)
                    this.reloadComponent();
                },
                error: error => {
                    this.error_avatar = error;
                    this.loading_avatar = false;
                }
            });
    }

    onFileSelect(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.avatarForm.patchValue({ image: file });
        const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (file && allowedMimeTypes.includes(file.type)) {
            this.error_avatar = ""
            const reader = new FileReader();
            reader.onload = () => {
                this.imageData = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
        else{
            this.error_avatar = "Please enter a valid file"
            this.remove.nativeElement.click();
        }
    }

    onFileRemove() {
        this.imageData = this.temporaryImageData
    }

    reloadComponent() {
        let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }


}

