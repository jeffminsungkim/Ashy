import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { RegistrationFormComponent } from "@ashy/components/registration-form/registration-form";


@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {

  @ViewChild(RegistrationFormComponent) registrationForm: RegistrationFormComponent;

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    setTimeout(() => {
      this.registrationForm.emailInput.setFocus();
    }, 600);
  }

  ionViewDidEnter() {
    this.registrationForm.changeSumitButtonLabelTo('Log In');
    this.registrationForm.handleDynamicSubmitFunc('login');
  }

  goToPasswordReset() { this.navCtrl.push('PasswordResetPage'); }

  goToRegister() { this.navCtrl.push('SignupPage'); }
}
