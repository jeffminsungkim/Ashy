import { Component, Input, ViewChild } from "@angular/core";
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from "ionic-angular";
import { RegistrationFormComponent } from "@ashy/components/registration-form/registration-form";

import { AuthServiceProvider } from "@ashy/services/auth-service/auth-service";
import { InterfaceOption } from '@ashy/services/interface-option/interface-option';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { UtilityServiceProvider } from '@ashy/services/utility-service/utility-service';

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {

  @ViewChild(RegistrationFormComponent) registrationForm: RegistrationFormComponent;
  title: string = 'Create your account';
  signupLabel: string = 'Sign Up';

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public authService: AuthServiceProvider,
    private interfaceOpt: InterfaceOption,
    private localStorageService: LocalStorageServiceProvider,
    private utilityService: UtilityServiceProvider) {}

  ionViewDidLoad() {
    setTimeout(() => {
      this.registrationForm.emailInput.setFocus();
    }, 600);
  }

  async signup($event) {
    let loader = this.loadingCtrl.create(this.interfaceOpt.makeWaitLoaderOpt());
    loader.present();
    try {
      const res: any = await this.authService.emailSignUp($event);
      const hash = this.convertEmailToIdenticonHash($event.email);

      if (res) {
        this.saveIdenticonHash(hash);
        this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(res.message)).present();
        this.alertCtrl.create(this.interfaceOpt.makeEmailVerificationOpt()).present();
        loader.dismiss();
      }
    } catch (error) {
      console.error(error);
      loader.dismiss();
      this.toastCtrl.create(this.interfaceOpt.makeShowToastOpt(error.message)).present();
    }
  }

  convertEmailToIdenticonHash(email: string) {
    return this.utilityService.convertEmailToHash(email);
  }

  saveIdenticonHash(hash: string) {
    this.localStorageService.storeIdenticonHash(hash);
  }

  backToRoot() { this.navCtrl.pop(); }
}
