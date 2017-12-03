import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    private alertService: AlertServiceProvider,
    private authService: AuthServiceProvider,
    private userService: UserServiceProvider,
    private modalService: ModalServiceProvider) { }

  async login() {
    try {
      const user: any = await this.authService.emailLogin(this.user);
      if (user.emailVerified){
        this.userService.updateEmailVerificationStatus();
      }
      else{
        let emailAuthStatus = { emailVerified: user.emailVerified };
        this.modalService.showProfileModal(emailAuthStatus);
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