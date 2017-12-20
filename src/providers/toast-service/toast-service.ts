import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastServiceProvider {

  fieldRequiredMessage: string;

  constructor(public toastCtrl: ToastController) {
    this.fieldRequiredMessage = 'All fields are required.';
  }

  show(message: string, duration: number = 3000) {
    return this.toastCtrl.create({
      message,
      duration,
    }).present();
  }

  allFieldsRequired(duration: number = 3000) {
    return this.toastCtrl.create({
      message: this.fieldRequiredMessage,
      duration,
    }).present();
  }

}
