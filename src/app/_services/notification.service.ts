import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { MyNotification } from 'app/_models/notification';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    positions = ["toast-top-left", "toast-top-center", "toast-top-right", "toast-bottom-left", "toast-bottom-center", "toast-bottom-right"]

    constructor(private toastr: ToastrService) { }

    showNotification(notification: MyNotification) {
        switch (notification.type) {
            case 1:
                this.showSuccess(notification.title,notification.message,notification.position)
            break;

            case 2:
                this.showError(notification.title,notification.message,notification.position)
            break;
            case 3:
                this.showInfo(notification.title,notification.message,notification.position)
            break
            case 4:
                this.showWarning(notification.title,notification.message,notification.position)
            break

        }
    }

    showSuccess(title: String, message: String, position: number) {
        this.toastr.success(
            '<span data-notify="icon" class="nc-icon nc-check-2"></span>' +
            '<span data-notify="title"><b>' + title + ' - </b>' +
            '<span data-notify="message">' + message + '</span>', "",
            {
                closeButton: true,
                timeOut: 4000,
                enableHtml: true,
                progressBar: true,
                progressAnimation: 'decreasing',
                toastClass: "alert alert-sucess alert-with-icon",
                positionClass: this.positions[position]
            });
    }

    showError(title, message, position) {
        this.toastr.error(
            '<span data-notify="icon" class="nc-icon nc-simple-remove"></span>' +
            '<span data-notify="title"><b>' + title + ' - </b>' +
            '<span data-notify="message">' + message + '</span>', "",
            {
                closeButton: true,
                timeOut: 4000,
                enableHtml: true,
                progressBar: true,
                progressAnimation: 'decreasing',
                toastClass: "alert alert-error alert-with-icon",
                positionClass: this.positions[position]
            });
    }

    showInfo(title, message, position) {
        this.toastr.info(
            '<span data-notify="icon" class="nc-icon nc-alert-circle-i"></span>' +
            '<span data-notify="title"><b>' + title + ' - </b>' +
            '<span data-notify="message">' + message + '</span>', "",
            {
                closeButton: true,
                timeOut: 4000,
                enableHtml: true,
                progressBar: true,
                progressAnimation: 'decreasing',
                toastClass: "alert alert-info alert-with-icon",
                positionClass: this.positions[position]
            });
    }

    showWarning(title, message, position) {
        this.toastr.warning(
            '<span data-notify="icon" class="nc-icon nc-check-2"></span>' +
            '<span data-notify="title"><b>' + title + ' - </b>' +
            '<span data-notify="message">' + message + '</span>', "",
            {
                closeButton: true,
                timeOut: 4000,
                enableHtml: true,
                progressBar: true,
                progressAnimation: 'decreasing',
                toastClass: "alert alert-warning alert-with-icon",
                positionClass: this.positions[position]
            });
    }

}