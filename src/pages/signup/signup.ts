import { Component, Input, ViewChild } from "@angular/core";
import { IonicPage, NavController, AlertController, LoadingController, ToastController } from "ionic-angular";
import { RegistrationFormComponent } from "@ashy/components/registration-form/registration-form";

import { AuthServiceProvider } from "@ashy/services/auth-service/auth-service";
import { InterfaceOption } from '@ashy/services/interface-option/interface-option';


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
    private interfaceOpt: InterfaceOption) {}

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

      if (res) {
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

  backToRoot() { this.navCtrl.pop(); }
}
