import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { ErrorDetectionServiceProvider } from '../../providers/error-detection-service/error-detection-service';

@Injectable()
export class AlertServiceProvider {

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthServiceProvider,
    private toastService: ToastServiceProvider,
    private errorDetectionService: ErrorDetectionServiceProvider) { }

  presentErrorMessage(message: string) {
    this.alertCtrl.create({
      title: "Oops! Be careful :(",
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    }).present();
  }

  notifyVerificationEmailIsSent() {
    this.alertCtrl.create({
      title: 'Verification Email has sent!',
      subTitle: 'Please confirm the verification link from your email account.',
      message: 'Please wait this might take a few minutes. Try it again if you have not received the email link.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    }).present();
  }

  notifyPasswordResetEmailIsSent() {
    this.alertCtrl.create({
      title: 'Verification Email has sent!',
      subTitle: 'Please confirm the verification link from your email account. This might take a few minutes.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    }).present();
  }

  confirmSendPasswordResetEmail(email: string) {
    this.alertCtrl.create({
      title: 'Send Password Reset Email?',
      message: 'Please confirm the verification link from your email account. This might take a few minutes.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send',
          handler: _ => {
            this.sendPasswrodResetEmail(email);
          }
        }
      ]
    }).present();
  }

  async sendPasswrodResetEmail(email: string) {
    try {
      const res: any = await this.authService.resetPassword(email);
      if (res.status)
        this.notifyPasswordResetEmailIsSent();
    } catch(error) {
      console.log("error:", error);
      let errorMessage = this.errorDetectionService.inspectAnyErrors(error.code);
      this.toastService.show(errorMessage);
    }
  }
  
}