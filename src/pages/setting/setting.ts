import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  usersRef: AngularFireList<any>;

  constructor(
    private app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private afDB: AngularFireDatabase) {



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");

  }

  goToProfile() {
    this.navCtrl.push(ProfilePage);
  }

  logout() {
    this.authService.signOut().then(() => {
      this.app.getRootNav().setRoot('LoginPage');
    });
    console.log("logout");
  }
}