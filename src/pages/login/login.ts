import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ToastServiceProvider } from '../../providers/toast-service/toast-service';
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
    private alertService: AlertServiceProvider,
    private toastService: ToastServiceProvider,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private modalService: ModalServiceProvider) { }

  ionViewCanEnter() {
    // console.log('Runs before the view can enter. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can enter');
  }

  ionViewCanLeave() {
    // console.log('Runs before the view can leave. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can leave');
  }

  async login() {
    try {
      const user: any = await this.authService.emailLogin(this.user);
      if (user.emailVerified) {
        this.userService.updateEmailVerificationStatus();
      }
      else {
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