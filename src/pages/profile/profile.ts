import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  key: string;
  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private authService: AuthServiceProvider) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.key = this.navParams.get('key');
    console.log('ProfilePage User KEY:', this.navParams.get('key'));
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  requestEmailVerification() {
    this.authService.sendEmailVerification();
  }

}