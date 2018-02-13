import { Component, Input, ViewChild } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { RegistrationFormComponent } from "@ashy/components/registration-form/registration-form";

import { AlertServiceProvider } from "@ashy/services/alert-service/alert-service";
import { AuthServiceProvider } from "@ashy/services/auth-service/auth-service";
import { LoadingServiceProvider } from "@ashy/services/loading-service/loading-service";
import { ToastServiceProvider } from '@ashy/services/toast-service/toast-service';


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
    public alertService: AlertServiceProvider,
    public authService: AuthServiceProvider,
    public loadingService: LoadingServiceProvider,
    public toastService: ToastServiceProvider) {}

  ionViewDidLoad() {
    setTimeout(() => {
      this.registrationForm.emailInput.setFocus();
    }, 600);
  }

  async signup($event) {
    this.loadingService.showWaitLoader();
    try {
      const res: any = await this.authService.emailSignUp($event);

      if (res) {
        this.toastService.show(res.message);
        this.alertService.notifyToCheckVerificationEmail();
        this.loadingService.dismiss();
      }
    } catch (error) {
      console.error(error);
      this.loadingService.dismiss();
      this.toastService.show(error.message);
    }
  }

  backToRoot() { this.navCtrl.pop(); }
}
