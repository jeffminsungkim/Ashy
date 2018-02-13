import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, AlertController, LoadingController } from "ionic-angular";
import { RegistrationFormComponent } from "@ashy/components/registration-form/registration-form";

import { InterfaceOption } from '@ashy/services/interface-option//interface-option';
import { AuthServiceProvider } from "@ashy/services/auth-service/auth-service";
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';


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
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private interfaceOpt: InterfaceOption,
    public authService: AuthServiceProvider,
    private localStorageService: LocalStorageServiceProvider) {}

  ionViewDidLoad() {
    setTimeout(() => {
      this.registrationForm.emailInput.setFocus();
    }, 600);
  }

  async login($event) {
    let loader = this.loadingCtrl.create(this.interfaceOpt.makeWaitLoaderOpt());
    loader.present();
    try {
      const res = await this.authService.emailLogin($event);

      if (res) {
        this.localStorageService.reStoreAccessToken('accessToken');
        loader.dismiss();
      }
    } catch (err) {
      this.alertCtrl.create(this.interfaceOpt.makeErrorMessageOpt(err.message)).present();
      loader.dismiss();
    }
  }

  goToPasswordReset() { this.navCtrl.push('PasswordResetPage'); }

  goToRegister() { this.navCtrl.push('SignupPage'); }
}
