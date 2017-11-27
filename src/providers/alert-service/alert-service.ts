import { Injectable } from '@angular/core';
import { AlertController, ViewController } from 'ionic-angular';

@Injectable()
export class AlertServiceProvider {

  constructor(private alertCtrl: AlertController) { }

  presentEmailIsSent(viewCtrl: ViewController) {
    return this.alertCtrl.create({
      title: 'Verification Email has sent!',
      subTitle: 'Please confirm the verification link from your email account. This might take a few minutes.',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: _ => {
            viewCtrl.dismiss();
          }
        }
      ]
    }).present();
  }
}