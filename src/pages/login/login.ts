import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ModalServiceProvider } from '../../providers/modal-service/modal-service';
import { ToastController } from 'ionic-angular';

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
    private authService: AuthServiceProvider,
    private modalService: ModalServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    // this.afAuth.authState.subscribe(user => {
    //   if (user && user.uid) {
    //     this.navCtrl.setRoot(HomePage);
    //   }
    // });
    // if (this.authService.authenticated && this.authService.currentUser != null)
    //   this.navCtrl.setRoot(HomePage);
  }

  ionViewWillLoad() {
    // if (this.authService.authenticated) {
    //   this.toast.create({
    //       message: `Welcome to ChattyCherry, ${this.authService.currentUser.email}`,
    //       duration: 3000
    //     }).present();
    // } else {
    //   this.toast.create({
    //       message: `Could not find authentication details`,
    //       duration: 3000
    //     }).present();
    // }
  }

  login() {
    this.authService.emailLogin(this.user).then(userData => {
      console.log("LOGIN USER DATA", userData);
      if (this.authService.isUserEmailVerified)
        this.navCtrl.setRoot('HomePage');
      else
        this.modalService.showProfileModal();

    })
    .catch((err) => {
      this.toast.create({
          message: err.message,
          duration: 3000
        }).present();
    });
  }

  goToRegister() {
    this.navCtrl.push('RegisterPage');
  }
}