import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import { LoginPage } from '../../pages/login/login';
import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(
    private app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  goToProfile() {
    this.navCtrl.push(ProfilePage);
  }

  logout() {
    this.authService.signOut().then(() => {
      this.app.getRootNav().setRoot(LoginPage);
    });

  }
}