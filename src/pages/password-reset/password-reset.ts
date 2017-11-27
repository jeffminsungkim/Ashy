import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {
  email: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertService: AlertServiceProvider) { }

  ionViewDidLoad() {

  }

  requestPasswordResetEmail() {
    this.alertService.confirmSendPasswordResetEmail(this.email);
  }
}
