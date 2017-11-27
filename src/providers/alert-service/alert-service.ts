import { Injectable } from '@angular/core';
import { AlertController, ViewController } from 'ionic-angular';

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

  presentEmailIsSent(viewCtrl: ViewController) {
    return this.alertCtrl.create({
      title: 'Verification Email has sent!',
      subTitle: 'Please confirm the verification link from your email account. This might take a few minutes.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: _ => {
            viewCtrl.dismiss();
          }
        }
      ]
    }).present();
  }

  presentPasswordResetEmailIsSent() {
    return this.alertCtrl.create({
      title: 'Verification Email has sent!',
      subTitle: 'Please confirm the verification link from your email account. This might take a few minutes.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        }
      ]
    }).present();
  }

  confirmSendPasswordResetEmail(email: string) {
    return this.alertCtrl.create({
      title: 'Password Email has sent!',
      subTitle: 'Please confirm the verification link from your email account. This might take a few minutes.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: _ => {
            console.log("Cancel!");
          }
        },
        {
          text: 'Send',
          handler: _ => {
            console.log("Current User Email", this.authService.currentUserEmail);
            this.authService.resetPassword(email).then((res: any) => {
              console.log("Hi1");
              if (res.status)
                this.presentPasswordResetEmailIsSent();
            }).catch((error) => {
              let errorMessage = this.errorDetectionService.inspectAnyErrors(error.code);
              this.toastService.show(errorMessage);
            });
          }
        }
      ]
    }).present();
  }
}