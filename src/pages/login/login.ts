import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AlertServiceProvider } from '@ashy-services/alert-service/alert-service';
import { AuthServiceProvider } from '@ashy-services/auth-service/auth-service';
import { ModalServiceProvider } from '@ashy-services/modal-service/modal-service';
import { ToastServiceProvider } from '@ashy-services/toast-service/toast-service';
import { UserServiceProvider } from '@ashy-services/user-service/user-service';
import { User } from '@ashy-models/user';


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
    public alertService: AlertServiceProvider,
    public toastService: ToastServiceProvider,
    public authService: AuthServiceProvider,
    public userService: UserServiceProvider,
    public modalService: ModalServiceProvider) { }

  ionViewCanEnter() {
    // console.log('Runs before the view can enter. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can enter');
  }

  ionViewCanLeave() {
    // console.log('Runs before the view can leave. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can leave');
  }

  async login() {
    try {
      await this.authService.emailLogin(this.user);
      if (!this.userService.currentUserEmailVerified) {
        this.authService.sendEmailVerification();
        this.authService.signOut();
        this.alertService.notifyToCheckVerificationEmail();
      }
    } catch (err) {
      this.alertService.notifyErrorMessage(err.message);
    }
  }

  goToPasswordReset() {
    this.navCtrl.push('PasswordResetPage');
  }

  goToRegister() {
    this.navCtrl.push('RegisterPage');
  }
}