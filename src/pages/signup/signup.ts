import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { RegistrationFormComponent } from "@ashy/components/registration-form/registration-form";


@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {

  @ViewChild(RegistrationFormComponent) registrationForm: RegistrationFormComponent;

  constructor(public navCtrl: NavController) {}

  ionViewDidEnter() {
    this.registrationForm.changeSumitButtonLabelTo('Sign In');
    this.registrationForm.handleDynamicSubmitFunc('signup');
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.registrationForm.emailInput.setFocus();
    }, 600);
  }

  backToRoot() { this.navCtrl.pop(); }
}
