import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ModalServiceProvider } from '../../providers/modal-service/modal-service';

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
    private toastService: ToastServiceProvider,
    private alertService: AlertServiceProvider,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private modalService: ModalServiceProvider) {
  }

  ionViewCanEnter() {
    console.log('Runs before the view can enter. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can enter');
  }

  ionViewCanLeave() {
    console.log('Runs before the view can leave. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can leave');
  }

  ionViewDidLoad() {
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

  async login() {
    try {
      const user: any = await this.authService.emailLogin(this.user);
      console.log("LOGIN USER DATA", user);
      if (this.authService.isUserEmailVerified){
        this.userService.updateEmailVerificationStatus();
        this.navCtrl.setRoot('HomePage');
        this.toastService.show(`Signed in as ${user.email}`);
      }
      else{
        this.modalService.showProfileModal();
      }
    } catch (err) {
      this.alertService.presentErrorMessage(err.message);
    }
  }

  goToPasswordReset() {
    this.navCtrl.push('PasswordResetPage');
  }

  goToRegister() {
    this.navCtrl.push('RegisterPage');
  }
}