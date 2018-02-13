import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { RegistrationFormComponent } from "@ashy/components/registration-form/registration-form";

import { AlertServiceProvider } from "@ashy/services/alert-service/alert-service";
import { AuthServiceProvider } from "@ashy/services/auth-service/auth-service";
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { LoadingServiceProvider } from "@ashy/services/loading-service/loading-service";
import { ToastServiceProvider } from '@ashy/services/toast-service/toast-service';


@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {

  @ViewChild(RegistrationFormComponent) registrationForm: RegistrationFormComponent;
  title: string = 'Welcome back!';
  loginLabel: string = 'Log In';

  constructor(
    public navCtrl: NavController,
    public alertService: AlertServiceProvider,
    public authService: AuthServiceProvider,
    public loadingService: LoadingServiceProvider,
    private localStorageService: LocalStorageServiceProvider) {}

  ionViewDidLoad() {
    setTimeout(() => {
      this.registrationForm.emailInput.setFocus();
    }, 600);
  }

  async login($event) {
    this.loadingService.showWaitLoader();
    try {
      const res = await this.authService.emailLogin($event);

      if (res) {
        this.localStorageService.reStoreAccessToken('accessToken');
        this.loadingService.dismiss();
      }
    } catch (err) {
      this.alertService.notifyErrorMessage(err.message);
      this.loadingService.dismiss();
    }
  }

  goToPasswordReset() { this.navCtrl.push('PasswordResetPage'); }

  goToRegister() { this.navCtrl.push('SignupPage'); }
}
