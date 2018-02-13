import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { AuthServiceProvider } from '@ashy/services/auth-service/auth-service';
import { ToastServiceProvider } from '@ashy/services/toast-service/toast-service';

@Injectable()
export class AlertServiceProvider {

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthServiceProvider,
    public toastService: ToastServiceProvider) { }

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

  notifyCommingSoon(message: string) {
    this.alertCtrl.create({
      title: `${message}`,
      message: `${message} feature is comming soon.`,
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
      title: 'Email has sent!',
      subTitle: 'Please wait this might take a few minutes.',
      message: 'Try it again if you have not received an email.',
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
      this.toastService.show(error.message);
    }
  }

  notifyRoomDestroyed() {
    this.alertCtrl.create({
      title: 'Oops! :(',
      message: 'Room has been destroyed.',
      buttons: [
        {
          text: 'Out',
          role: 'cancel'
        }
      ]
    }).present();
  }


}
