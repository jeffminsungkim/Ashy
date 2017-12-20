import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { AuthServiceProvider } from '../auth-service/auth-service';
import { ToastServiceProvider } from '../toast-service/toast-service';
import { ErrorDetectionServiceProvider } from '../error-detection-service/error-detection-service';

@Injectable()
export class AlertServiceProvider {

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthServiceProvider,
    public toastService: ToastServiceProvider,
    public errorDetectionService: ErrorDetectionServiceProvider) { }

  notifyErrorMessage(message: string) {
    this.alertCtrl.create({
      title: 'Oops! Be careful :(',
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    }).present();
  }

  notifyToCheckVerificationEmail() {
    this.alertCtrl.create({
      title: 'Verify your account',
      subTitle: 'Please confirm the verification link from your email account.',
      message: 'Please wait this might take a few minutes. Try it again if you have not received the email.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    }).present();
  }

  notifyPasswordResetEmailhasSent() {
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
        this.notifyPasswordResetEmailhasSent();
    } catch(error) {
      console.log("error:", error);
      let errorMessage = this.errorDetectionService.inspectAnyErrors(error.code);
      this.toastService.show(errorMessage);
    }
  }
  
}