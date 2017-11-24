import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ToastController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    private authService: AuthServiceProvider) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad LoginPage');
  //   this.afAuth.authState.subscribe(user => {
  //     if (user && user.uid) {
  //       this.navCtrl.setRoot(HomePage);
  //     }
  //   });
  // }

  // ionViewWillLoad() {
  //   this.afAuth.authState.subscribe(user => {
  //     if (user && user.uid && user.email) {
  //       this.toast.create({
  //         message: `Welcome to ChattyCherry, ${user.email}`,
  //         duration: 3000
  //       }).present();
  //     } else {
  //       this.toast.create({
  //         message: `Could not find authentication details`,
  //         duration: 3000
  //       }).present();
  //     }

  //   });
  // }

  login() {
    this.authService.login(this.user).then((res) => {
      this.navCtrl.setRoot(HomePage);
    })
    .catch((err) => {
      this.toast.create({
          message: err.message,
          duration: 3000
        }).present();
    });
  }

  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }
}