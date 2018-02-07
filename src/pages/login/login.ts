import { Component, Input, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

import { AlertServiceProvider } from "@ashy/services/alert-service/alert-service";
import { AuthServiceProvider } from "@ashy/services/auth-service/auth-service";
import { LoadingServiceProvider } from "@ashy/services/loading-service/loading-service";
import { ToastServiceProvider } from '@ashy/services/toast-service/toast-service';
import { UserServiceProvider } from "@ashy/services/user-service/user-service";
import { EmailSignup } from "@ashy/models/emailsignup";
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {

  @ViewChild('emailInput') emailInput;
  user = {} as EmailSignup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertService: AlertServiceProvider,
    public authService: AuthServiceProvider,
    public loadingService: LoadingServiceProvider,
    public toastService: ToastServiceProvider,
    public userService: UserServiceProvider
  ) {}

  ionViewDidLoad() {
    setTimeout(() => {
      this.emailInput.setFocus();
    }, 1000);
  }

  async login() {
    this.loadingService.showWaitLoader();
    try {
      const res = await this.authService.emailLogin(this.user);
      if (res) this.loadingService.dismiss();
    } catch (err) {
      this.alertService.notifyErrorMessage(err.message);
      this.loadingService.dismiss();
    }
  }

  goToPasswordReset() {
    this.navCtrl.push("PasswordResetPage");
  }

  goToRegister() {
    this.navCtrl.push("RegisterPage");
  }
}
